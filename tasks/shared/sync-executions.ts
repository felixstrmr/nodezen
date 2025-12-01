import { logger } from "@trigger.dev/sdk";
import { createInstanceContext } from "@/tasks/shared/create-instance-context";
import type { Supabase } from "@/types";
import type { Execution, ExecutionStatus } from "@/types/n8n";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

type ExistingExecution = {
  id: string;
  n8n_execution_id: string;
  mode: string;
  status: string;
  started_at: string;
  stopped_at: string | null;
  workflow: {
    instance: string;
  };
  workspace: string;
};

type Workflow = {
  id: string;
  is_monitored: boolean;
  n8n_workflow_id: string;
  workspace: string;
};

export async function syncExecutions(
  supabase: Supabase,
  instanceId: string,
  workspaceId: string
) {
  const { client } = await createInstanceContext(supabase, instanceId);

  const executions = await client.getExecutions();
  const existingExecutions = await getExistingExecutions(supabase, instanceId);
  const workflows = await getWorkflows(supabase, instanceId);

  const { toCreate, toUpdate } = calculateExecutionsDiff(
    workspaceId,
    existingExecutions,
    executions,
    workflows
  );

  logger.info(
    `Found ${toCreate.length} to create, ${toUpdate.length} to update`,
    { instanceId }
  );

  await Promise.allSettled([
    createExecutions(supabase, toCreate),
    ...toUpdate.map((execution) => updateExecution(supabase, execution)),
  ]);
}

async function getExistingExecutions(supabase: Supabase, instanceId: string) {
  const PAGE_SIZE = 1000;
  const results: ExistingExecution[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const query = supabase
      .from("executions")
      .select(
        "id, n8n_execution_id, mode, status, started_at, stopped_at, workflow(instance), workspace"
      )
      .eq("workflow.instance", instanceId)
      .order("id", { ascending: true })
      .range(start, end)
      .throwOnError();

    const { data } = await query;

    if (data && data.length > 0) {
      results.push(...data);
      hasMore = data.length === PAGE_SIZE;
      page += 1;
    } else {
      hasMore = false;
    }
  }

  return results;
}

async function getWorkflows(supabase: Supabase, instanceId: string) {
  const { data } = await supabase
    .from("workflows")
    .select("id, instance, is_monitored, n8n_workflow_id, workspace")
    .eq("instance", instanceId)
    .throwOnError();

  logger.info(`${data.length} workflows fetched`, {
    instanceId,
  });

  return data;
}

async function createExecutions(
  supabase: Supabase,
  executions: TablesInsert<"executions">[]
) {
  await supabase.from("executions").insert(executions).throwOnError();
}

async function updateExecution(
  supabase: Supabase,
  execution: TablesUpdate<"executions">
) {
  await supabase
    .from("executions")
    .update(execution)
    .eq("id", execution.id as string)
    .throwOnError();
}

function calculateExecutionsDiff(
  workspaceId: string,
  existingExecutions: ExistingExecution[],
  newExecutions: Execution[],
  workflows: Workflow[]
) {
  const existingExecutionsMap = new Map(
    existingExecutions.map((e) => [e.n8n_execution_id, e])
  );

  const toCreate: TablesInsert<"executions">[] = [];
  const toUpdate: TablesUpdate<"executions">[] = [];

  for (const execution of newExecutions) {
    const workflowId = workflows.find(
      (w) => w.n8n_workflow_id === execution.workflowId
    )?.id;

    if (!(execution.id && workflowId)) {
      continue;
    }

    const existing = existingExecutionsMap.get(execution.id);

    if (!existing) {
      toCreate.push({
        mode: execution.mode,
        n8n_execution_id: execution.id,
        status: execution.status as ExecutionStatus,
        started_at: execution.startedAt,
        stopped_at: execution.stoppedAt,
        workflow: workflowId,
        workspace: workspaceId,
      });
    } else if (existing.status !== execution.status) {
      toUpdate.push({
        id: existing.id,
        status: execution.status as ExecutionStatus,
        stopped_at: execution.stoppedAt,
      });
    }
  }

  return { toCreate, toUpdate };
}
