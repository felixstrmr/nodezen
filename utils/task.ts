import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Execution } from "@/types/n8n";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

function calculateDuration(startedAt: string, stoppedAt?: string): number {
  const start = new Date(startedAt).getTime();
  const stop = stoppedAt ? new Date(stoppedAt).getTime() : Date.now();
  return Math.max(0, stop - start);
}

function extractErrorInfo(execution: Execution): {
  errorMessage: string | null;
  errorNode: string | null;
} {
  if (execution.status !== "error" || !execution.data) {
    return { errorMessage: null, errorNode: null };
  }

  const resultData = execution.data.resultData;
  if (!resultData?.runData) {
    return { errorMessage: null, errorNode: null };
  }

  // Find the first node with an error
  for (const [nodeName, nodeData] of Object.entries(resultData.runData)) {
    if (Array.isArray(nodeData) && nodeData.length > 0) {
      const lastRun = nodeData.at(-1);
      if (lastRun?.error) {
        return {
          errorMessage: lastRun.error.message || null,
          errorNode: nodeName,
        };
      }
    }
  }

  return { errorMessage: null, errorNode: null };
}

async function updateWorkflowsWithLatestExecution(
  supabase: SupabaseClient<Database>,
  workflowIds: string[]
): Promise<void> {
  if (workflowIds.length === 0) {
    return;
  }

  const { data: latestExecutions } = await supabase
    .from("executions")
    .select("workflow, started_at, stopped_at, status")
    .in("workflow", workflowIds)
    .order("started_at", { ascending: false })
    .throwOnError();

  if (!latestExecutions || latestExecutions.length === 0) {
    return;
  }

  // Group executions by workflow and get the latest one for each
  const latestByWorkflow = new Map<
    string,
    {
      started_at: string;
      stopped_at: string | null;
      status: Database["public"]["Enums"]["execution_statuses"];
    }
  >();

  for (const execution of latestExecutions) {
    if (!latestByWorkflow.has(execution.workflow)) {
      latestByWorkflow.set(execution.workflow, {
        started_at: execution.started_at,
        stopped_at: execution.stopped_at,
        status: execution.status,
      });
    }
  }
}

async function syncWorkflows(
  supabase: SupabaseClient<Database>,
  client: n8nClient,
  instance: { id: string; workspace: { id: string } }
): Promise<{
  workflowsSynced: number;
  workflowsUpdated: number;
  workflowsDeleted: number;
  error: boolean;
}> {
  const workflows = await client.getWorkflows();
  const activeWorkflows = workflows.filter(
    (workflow) => workflow.id && !workflow.isArchived
  );

  if (activeWorkflows.length === 0) {
    return {
      workflowsSynced: 0,
      workflowsUpdated: 0,
      workflowsDeleted: 0,
      error: false,
    };
  }

  const { data: existingWorkflows } = await supabase
    .from("workflows")
    .select("id, n8n_workflow_id")
    .eq("instance", instance.id)
    .throwOnError();

  const existingWorkflowIds = new Set(
    existingWorkflows?.map((w) => w.n8n_workflow_id) || []
  );

  const workflowsToCreate = activeWorkflows.filter(
    (w) => w.id && !existingWorkflowIds.has(w.id)
  );
  const workflowsToUpdate = activeWorkflows.filter(
    (w) => w.id && existingWorkflowIds.has(w.id)
  );
  const workflowsToDelete =
    existingWorkflows?.filter(
      (w) =>
        w.n8n_workflow_id &&
        !activeWorkflows.some((aw) => aw.id === w.n8n_workflow_id)
    ) || [];

  try {
    await Promise.all([
      ...workflowsToCreate.map((workflow) =>
        supabase
          .from("workflows")
          .insert({
            workspace: instance.workspace.id,
            instance: instance.id,
            name: workflow.name,
            n8n_workflow_id: workflow.id as string,
            is_active: workflow.active,
            is_monitored: true,
          })
          .throwOnError()
      ),
      ...workflowsToUpdate.map((workflow) =>
        supabase
          .from("workflows")
          .update({
            name: workflow.name,
            is_active: workflow.active,
          })
          .eq("n8n_workflow_id", workflow.id as string)
          .throwOnError()
      ),
      ...workflowsToDelete.map((workflow) =>
        supabase
          .from("workflows")
          .delete()
          .eq("n8n_workflow_id", workflow.n8n_workflow_id)
          .throwOnError()
      ),
    ]);

    return {
      workflowsSynced: workflowsToCreate.length,
      workflowsUpdated: workflowsToUpdate.length,
      workflowsDeleted: workflowsToDelete.length,
      error: false,
    };
  } catch (error) {
    logger.error(`Error syncing workflows for instance ${instance.id}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      workflowsSynced: 0,
      workflowsUpdated: 0,
      workflowsDeleted: 0,
      error: true,
    };
  }
}

async function syncExecutions(
  supabase: SupabaseClient<Database>,
  client: n8nClient,
  instance: { id: string; workspace: { id: string } },
  workflowIdMap: Map<string, string>
): Promise<{
  executionsSynced: number;
  executionsUpdated: number;
  error: boolean;
}> {
  if (workflowIdMap.size === 0) {
    return { executionsSynced: 0, executionsUpdated: 0, error: false };
  }

  try {
    const executions = await client.getExecutions();

    if (executions.length === 0) {
      return { executionsSynced: 0, executionsUpdated: 0, error: false };
    }

    const validExecutions = executions.filter(
      (exec) => exec.workflowId && workflowIdMap.has(exec.workflowId)
    );

    if (validExecutions.length === 0) {
      return { executionsSynced: 0, executionsUpdated: 0, error: false };
    }

    const { data: existingExecutions } = await supabase
      .from("executions")
      .select("n8n_execution_id")
      .eq("workspace", instance.workspace.id)
      .in("workflow", Array.from(workflowIdMap.values()))
      .throwOnError();

    const existingExecutionIds = new Set(
      existingExecutions?.map((e) => e.n8n_execution_id) || []
    );

    const executionsToCreate = validExecutions.filter(
      (e) => !existingExecutionIds.has(e.id)
    );
    const executionsToUpdate = validExecutions.filter((e) =>
      existingExecutionIds.has(e.id)
    );

    await Promise.all([
      ...executionsToCreate.map((execution) => {
        const workflowId = execution.workflowId
          ? workflowIdMap.get(execution.workflowId)
          : null;

        if (!workflowId) {
          return Promise.resolve();
        }

        const { errorMessage, errorNode } = extractErrorInfo(execution);

        return supabase
          .from("executions")
          .insert({
            workspace: instance.workspace.id,
            workflow: workflowId,
            n8n_execution_id: execution.id,
            status: (execution.status ||
              "running") as Database["public"]["Enums"]["execution_statuses"],
            mode: execution.mode as Database["public"]["Enums"]["execution_modes"],
            started_at: execution.startedAt,
            stopped_at: execution.stoppedAt || null,
            duration_ms: calculateDuration(
              execution.startedAt,
              execution.stoppedAt
            ),
            error_message: errorMessage,
            error_node: errorNode,
          })
          .throwOnError();
      }),
      ...executionsToUpdate.map((execution) => {
        const workflowId = execution.workflowId
          ? workflowIdMap.get(execution.workflowId)
          : null;

        if (!workflowId) {
          return Promise.resolve();
        }

        const { errorMessage, errorNode } = extractErrorInfo(execution);

        return supabase
          .from("executions")
          .update({
            status: (execution.status ||
              "running") as Database["public"]["Enums"]["execution_statuses"],
            mode: execution.mode as Database["public"]["Enums"]["execution_modes"],
            started_at: execution.startedAt,
            stopped_at: execution.stoppedAt || null,
            duration_ms: calculateDuration(
              execution.startedAt,
              execution.stoppedAt
            ),
            error_message: errorMessage,
            error_node: errorNode,
          })
          .eq("n8n_execution_id", execution.id)
          .throwOnError();
      }),
    ]);

    // Update workflows with latest execution information
    const workflowIds = Array.from(workflowIdMap.values());
    await updateWorkflowsWithLatestExecution(supabase, workflowIds);

    return {
      executionsSynced: executionsToCreate.length,
      executionsUpdated: executionsToUpdate.length,
      error: false,
    };
  } catch (error) {
    logger.error(`Error syncing executions for instance ${instance.id}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return { executionsSynced: 0, executionsUpdated: 0, error: true };
  }
}

export async function syncInstance(
  supabase: SupabaseClient<Database>,
  instance: {
    id: string;
    url: string;
    api_key: string;
    workspace: {
      id: string;
      subscription: "free" | "pro" | "premium";
    };
  }
) {
  logger.info(`Syncing instance ${instance.id}`);

  const decrpytedApiKey = await decrypt(
    instance.api_key,
    process.env.ENCRYPTION_SECRET as string
  );
  const client = new n8nClient(instance.url, decrpytedApiKey);
  const isConnected = await client.testConnection();
  const status = isConnected ? "connected" : "disconnected";

  await supabase
    .from("instances")
    .update({ status, last_sync_at: new Date().toISOString() })
    .eq("id", instance.id)
    .throwOnError();

  if (!isConnected) {
    logger.info(`Instance ${instance.id} is disconnected, skipping`);
    return;
  }

  const workflowSyncResult = await syncWorkflows(supabase, client, instance);

  if (workflowSyncResult.error) {
    logger.warn(
      `Workflow sync had errors for instance ${instance.id}, continuing with execution sync`
    );
  }

  // Get updated workflows to create n8n_workflow_id -> local workflow id mapping
  const { data: allWorkflows } = await supabase
    .from("workflows")
    .select("id, n8n_workflow_id")
    .eq("instance", instance.id)
    .throwOnError();

  const workflowIdMap = new Map<string, string>(
    allWorkflows?.map((w) => [w.n8n_workflow_id, w.id]) || []
  );

  if (workflowIdMap.size === 0) {
    logger.info(
      `No workflows found after sync for instance ${instance.id}, skipping execution sync`
    );
    logger.info(
      `Workflows: ${workflowSyncResult.workflowsSynced} synced, ${workflowSyncResult.workflowsUpdated} updated, ${workflowSyncResult.workflowsDeleted} deleted for instance ${instance.id}`
    );
    return;
  }

  const executionSyncResult = await syncExecutions(
    supabase,
    client,
    instance,
    workflowIdMap
  );

  logger.info(
    `Workflows: ${workflowSyncResult.workflowsSynced} synced, ${workflowSyncResult.workflowsUpdated} updated, ${workflowSyncResult.workflowsDeleted} deleted for instance ${instance.id}`
  );
  logger.info(
    `Executions: ${executionSyncResult.executionsSynced} synced, ${executionSyncResult.executionsUpdated} updated for instance ${instance.id}`
  );

  if (workflowSyncResult.error || executionSyncResult.error) {
    logger.warn(`Error(s) occurred during sync for instance ${instance.id}`);
  }
}
