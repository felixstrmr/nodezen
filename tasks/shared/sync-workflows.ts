import { logger } from "@trigger.dev/sdk";
import { createInstanceContext } from "@/tasks/shared/create-instance-context";
import type { Supabase } from "@/types";
import type { Workflow } from "@/types/n8n";
import type { Json, TablesInsert, TablesUpdate } from "@/types/supabase";

type ExistingWorkflow = {
  id: string;
  name: string;
  n8n_workflow_id: string;
  n8n_version_id: string;
  is_active: boolean;
  nodes: Json;
  instance: string;
};

export async function syncWorkflows(
  supabase: Supabase,
  instanceId: string,
  workspaceId: string
) {
  const { client } = await createInstanceContext(supabase, instanceId);

  const workflows = await client.getWorkflows();
  const existingWorkflows = await getExistingWorkflows(supabase, instanceId);

  const { toCreate, toUpdate, toDelete } = calculateWorkflowsDiff(
    instanceId,
    workspaceId,
    existingWorkflows,
    workflows
  );

  logger.info(
    `Found ${toCreate.length} to create, ${toUpdate.length} to update, ${toDelete.length} to delete`,
    { instanceId }
  );

  await Promise.allSettled([
    createWorkflows(supabase, toCreate),
    deleteWorkflows(supabase, toDelete),
    ...toUpdate.map((workflow) => updateWorkflow(supabase, workflow)),
  ]);
}

async function getExistingWorkflows(supabase: Supabase, instanceId: string) {
  const { data } = await supabase
    .from("workflows")
    .select(
      "id, name, n8n_workflow_id, n8n_version_id, is_active, nodes, instance"
    )
    .eq("instance", instanceId)
    .throwOnError();

  logger.info(`${data.length} existing workflows fetched`, {
    instanceId,
  });

  return data;
}

async function createWorkflows(
  supabase: Supabase,
  workflows: TablesInsert<"workflows">[]
) {
  await supabase.from("workflows").insert(workflows).throwOnError();
}

async function updateWorkflow(
  supabase: Supabase,
  workflow: TablesUpdate<"workflows">
) {
  const { data } = await supabase
    .from("workflows")
    .update(workflow)
    .eq("id", workflow.id as string)
    .throwOnError();

  return data;
}

async function deleteWorkflows(
  supabase: Supabase,
  workflows: ExistingWorkflow[]
) {
  await supabase
    .from("workflows")
    .delete()
    .in(
      "id",
      workflows.map((w) => w.id)
    )
    .throwOnError();
}

function calculateWorkflowsDiff(
  instanceId: string,
  workspaceId: string,
  existingWorkflows: ExistingWorkflow[],
  newWorkflows: Workflow[]
) {
  const existingWorkflowsMap = new Map(
    existingWorkflows.map((w) => [w.n8n_workflow_id, w])
  );

  const workflowIds = new Set(
    newWorkflows.map((w) => w.id).filter((id): id is string => Boolean(id))
  );

  const toCreate: TablesInsert<"workflows">[] = [];
  const toUpdate: TablesUpdate<"workflows">[] = [];

  const toDelete = existingWorkflows.filter(
    (existing) => !workflowIds.has(existing.n8n_workflow_id)
  );

  for (const workflow of newWorkflows) {
    if (!(workflow.id && workflow.versionId)) {
      continue;
    }

    const existing = existingWorkflowsMap.get(workflow.id);

    if (!existing) {
      toCreate.push({
        is_active: workflow.active,
        n8n_version_id: workflow.versionId,
        n8n_workflow_id: workflow.id,
        name: workflow.name,
        nodes: workflow.nodes as Json,
        instance: instanceId,
        workspace: workspaceId,
      });
    } else if (existing.n8n_version_id !== workflow.versionId) {
      toUpdate.push({
        id: existing.id,
        is_active: workflow.active,
        name: workflow.name,
        n8n_version_id: workflow.versionId,
        nodes: workflow.nodes as Json,
        n8n_workflow_id: workflow.id,
      });
    }
  }

  return { toCreate, toUpdate, toDelete };
}
