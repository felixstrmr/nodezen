import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import { createN8nClient } from "@/tasks/shared/create-n8n-client";
import { getInstances } from "@/tasks/shared/get-instances";
import type { WorkspaceSubscription } from "@/types";
import type { Execution } from "@/types/n8n";
import type { Database, TablesInsert } from "@/types/supabase";

type Instance = {
  id: string;
  n8n_url: string;
  n8n_api_key: string;
  workspace: {
    id: string;
    subscription: "free" | "pro" | "ultra";
  };
};

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncExecutionsTask = schedules.task({
  id: "sync-executions-task",
  run: async ({ externalId }) => {
    const workspaceSubscription = externalId as WorkspaceSubscription;

    const instances = await getInstances(supabase, workspaceSubscription);

    if (instances.length === 0) {
      return;
    }

    const full = instances.filter(
      (instance) => instance.last_execution_sync_at === null
    );
    const incremental = instances.filter(
      (instance) => instance.last_execution_sync_at !== null
    );

    await Promise.all(full.map(syncFullExecutions));
    await Promise.all(incremental.map(syncIncrementalExecutions));
  },
});

async function syncFullExecutions(instance: Instance) {
  const client = await createN8nClient(instance.n8n_url, instance.n8n_api_key);
  const status = await client.getStatus();

  logger.info(`Checking instance ${instance.id} status...`, {
    instanceId: instance.id,
  });

  await supabase
    .from("instances")
    .update({
      status,
      last_status_check_at: new Date().toISOString(),
    })
    .eq("id", instance.id)
    .throwOnError();

  if (status === "disconnected") {
    logger.warn("Instance is disconnected. Skipping full execution sync...", {
      instanceId: instance.id,
    });
    return;
  }

  logger.info("Instance is connected. Continuing with full execution sync...", {
    instanceId: instance.id,
  });

  const { data: workflows } = await supabase
    .from("workflows")
    .select("id, name, n8n_workflow_id")
    .eq("instance", instance.id)
    .throwOnError();

  const workflowMap = new Map(
    workflows.map((workflow) => [workflow.n8n_workflow_id, workflow.id])
  );

  const executions = await client.getExecutions({ includeData: true });

  const toUpsert = executions.map((execution) => {
    const errorInfo = extractErrorInfo(execution);
    return {
      n8n_execution_id: execution.id,
      mode: execution.mode,
      started_at: execution.startedAt,
      stopped_at: execution.stoppedAt,
      status: execution.status,
      workflow: workflowMap.get(execution.workflowId as string),
      workspace: instance.workspace.id,
      error_node: errorInfo?.node ?? null,
      error_message: errorInfo?.message ?? null,
    };
  }) as TablesInsert<"executions">[];

  if (toUpsert.length === 0) {
    return;
  }

  logger.info(`Upserting ${toUpsert.length} executions...`, {
    instanceId: instance.id,
  });

  await supabase
    .from("executions")
    .upsert(toUpsert, {
      onConflict: "workflow,n8n_execution_id",
    })
    .throwOnError();

  logger.info(`Successfully upserted ${toUpsert.length} executions`, {
    instanceId: instance.id,
  });

  /*
  await supabase
    .from("instances")
    .update({
      last_execution_sync_at: new Date().toISOString(),
    })
    .eq("id", instance.id)
    .throwOnError();

  logger.info("Successfully updated instance last execution sync timestamp", {
    instanceId: instance.id,
  });
  */
}

/**
 * Extracts error information from an n8n execution.
 * Returns the node ID/name and error message if an error is found.
 */
function extractErrorInfo(
  execution: Execution
): { node: string; message: string } | null {
  const resultData = execution.data?.resultData;
  const runData = resultData?.runData;
  if (!runData) {
    return null;
  }

  const lastNodeExecuted = resultData?.lastNodeExecuted;

  // If we have a lastNodeExecuted, check that node first
  if (lastNodeExecuted) {
    const error = findErrorInNodeRuns(runData[lastNodeExecuted]);
    if (error) {
      return { node: lastNodeExecuted, message: error };
    }
  }

  // Otherwise, find the first node with an error
  for (const [nodeId, nodeRuns] of Object.entries(runData)) {
    const error = findErrorInNodeRuns(
      nodeRuns as Array<{ error?: { message: string } }> | undefined
    );
    if (error) {
      return { node: nodeId, message: error };
    }
  }

  return null;
}

/**
 * Finds an error message in node runs array.
 */
function findErrorInNodeRuns(
  nodeRuns: Array<{ error?: { message: string } }> | undefined
): string | null {
  if (!Array.isArray(nodeRuns)) {
    return null;
  }

  for (const run of nodeRuns) {
    if (run.error?.message) {
      return run.error.message;
    }
  }

  return null;
}

async function syncIncrementalExecutions(_instance: Instance) {
  // TODO: Implement incremental execution sync
}
