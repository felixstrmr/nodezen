import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { createN8nClient } from "@/tasks/shared/create-n8n-client";
import { getInstances } from "@/tasks/shared/get-instances";
import type { WorkspaceSubscription } from "@/types";
import type { Workflow as N8nWorkflow } from "@/types/n8n";
import type {
  Database,
  Json,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase";

type Instance = {
  id: string;
  n8n_url: string;
  n8n_api_key: string;
  workspace: {
    id: string;
    subscription: "free" | "pro" | "ultra";
  };
};

type Workflow = {
  id: string;
  name: string;
  n8n_workflow_id: string;
  n8n_version_id: string;
  is_active: boolean;
  nodes: Json;
};

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncWorkflowsTask = schedules.task({
  id: "sync-workflows-task",
  run: async ({ externalId }) => {
    const workspaceSubscription = externalId as WorkspaceSubscription;

    const instances = await getInstances(supabase, workspaceSubscription);

    if (instances.length === 0) {
      return;
    }

    await Promise.all(instances.map(syncWorkflows));
  },
});

async function syncWorkflows(instance: Instance) {
  const client = await createN8nClient(instance.n8n_url, instance.n8n_api_key);
  const status = await client.getStatus();

  console.log(`Checking instance ${instance.id} status...`, {
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
    console.log("Instance is disconnected. Skipping workflow sync...", {
      instanceId: instance.id,
    });

    // TODO: Instance status alert

    return;
  }

  console.log("Instance is connected. Continuing with workflow sync...", {
    instanceId: instance.id,
  });

  const { data: existingWorkflows } = await supabase
    .from("workflows")
    .select("id, name, n8n_workflow_id, n8n_version_id, is_active, nodes")
    .eq("instance", instance.id)
    .throwOnError();

  const n8nWorkflows = await client.getWorkflows();

  const { toCreate, toUpdate, toDelete } = calculateWorkflowDiff(
    existingWorkflows,
    n8nWorkflows
  );

  console.log(
    `Found ${toCreate.length} to create, ${toUpdate.length} to update, ${toDelete.length} to delete...`,
    {
      instanceId: instance.id,
      toCreateCount: toCreate.length,
      toUpdateCount: toUpdate.length,
      toDeleteCount: toDelete.length,
    }
  );

  await Promise.allSettled([
    createWorkflows(toCreate, instance.id, instance.workspace.id),
    updateWorkflows(toUpdate, instance.id),
    deleteWorkflows(toDelete, instance.id),
  ]);
}

function calculateWorkflowDiff(
  existingWorkflows: Workflow[],
  n8nWorkflows: N8nWorkflow[]
) {
  const existingWorkflowMap = new Map(
    existingWorkflows.map((w) => [w.n8n_workflow_id, w])
  );

  const n8nWorkflowIds = new Set(
    n8nWorkflows.map((w) => w.id).filter((id): id is string => Boolean(id))
  );

  const toCreate: Workflow[] = [];
  const toUpdate: Workflow[] = [];

  const toDelete = existingWorkflows.filter(
    (existing) => !n8nWorkflowIds.has(existing.n8n_workflow_id)
  );

  for (const workflow of n8nWorkflows) {
    if (!(workflow.id && workflow.versionId)) {
      continue;
    }

    const existing = existingWorkflowMap.get(workflow.id);

    if (!existing) {
      toCreate.push({
        id: crypto.randomUUID(),
        name: workflow.name,
        n8n_workflow_id: workflow.id,
        n8n_version_id: workflow.versionId,
        is_active: workflow.active,
        nodes: workflow.nodes as Json,
      });
    } else if (existing.n8n_version_id !== workflow.versionId) {
      toUpdate.push({
        id: existing.id,
        name: workflow.name,
        n8n_workflow_id: workflow.id,
        n8n_version_id: workflow.versionId,
        is_active: workflow.active,
        nodes: workflow.nodes as Json,
      });
    }
  }

  return { toCreate, toUpdate, toDelete };
}

async function createWorkflows(
  workflows: Workflow[],
  instanceId: string,
  workspaceId: string
) {
  const inserts = workflows.map((workflow) => ({
    id: workflow.id,
    workspace: workspaceId,
    instance: instanceId,
    is_active: workflow.is_active,
    n8n_version_id: workflow.n8n_version_id,
    n8n_workflow_id: workflow.n8n_workflow_id,
    name: workflow.name,
    nodes: workflow.nodes,
  })) as TablesInsert<"workflows">[];

  if (inserts.length === 0) {
    return;
  }

  const batchSize = 100;

  for (let i = 0; i < inserts.length; i += batchSize) {
    const batch = inserts.slice(i, i + batchSize);
    await supabase.from("workflows").insert(batch).throwOnError();
  }

  console.log(`Successfully inserted ${inserts.length} workflows`, {
    instanceId,
    workspaceId,
  });
}

async function updateWorkflows(workflows: Workflow[], instanceId: string) {
  const updates = workflows.map((workflow) => ({
    id: workflow.id,
    is_active: workflow.is_active,
    name: workflow.name,
    n8n_version_id: workflow.n8n_version_id,
    nodes: workflow.nodes,
  })) as TablesUpdate<"workflows">[];

  if (updates.length === 0) {
    return;
  }

  const batchSize = 50;
  const batches: TablesUpdate<"workflows">[][] = [];

  for (let i = 0; i < updates.length; i += batchSize) {
    batches.push(updates.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.allSettled(
      batch.map((update) => {
        if (!update.id) {
          return Promise.resolve();
        }

        return supabase
          .from("workflows")
          .update(update)
          .eq("id", update.id)
          .throwOnError();
      })
    );
  }

  console.log(`Successfully updated ${updates.length} workflows`, {
    instanceId,
  });
}

async function deleteWorkflows(workflows: Workflow[], instanceId: string) {
  const deletes = workflows.map((workflow) => workflow.id);

  if (deletes.length === 0) {
    return;
  }

  const batchSize = 100;
  for (let i = 0; i < deletes.length; i += batchSize) {
    const batch = deletes.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((id) =>
        supabase.from("workflows").delete().eq("id", id).throwOnError()
      )
    );
  }

  console.log(`Successfully deleted ${deletes.length} workflows`, {
    instanceId,
  });
}
