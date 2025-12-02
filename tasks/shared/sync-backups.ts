import { logger } from "@trigger.dev/sdk";
import type { Supabase } from "@/types";
import type { Workflow } from "@/types/n8n";
import { createInstanceContext } from "./create-instance-context";

type ExistingBackup = {
  id: string;
  path: string;
  size: number;
  n8n_version_id: string;
  workspace: string;
  workflow: {
    instance: string;
    id: string;
    n8n_workflow_id: string;
  };
};

type DbWorkflow = {
  id: string;
  n8n_workflow_id: string;
  n8n_version_id: string;
};

export async function syncBackups(
  supabase: Supabase,
  instanceId: string,
  workspaceId: string
) {
  const { client } = await createInstanceContext(supabase, instanceId);

  const workflows = await client.getWorkflows();
  const existingBackups = await getExistingBackups(supabase, instanceId);
  const dbWorkflows = await getWorkflows(supabase, instanceId);

  const toCreate = calculateBackupsDiff(
    instanceId,
    existingBackups,
    workflows,
    dbWorkflows
  );

  logger.info(`Found ${toCreate.length} backups to create`, {
    instanceId,
  });

  await Promise.allSettled(
    toCreate.map((workflow) =>
      createBackup(supabase, instanceId, workspaceId, workflow)
    )
  );
}

async function getExistingBackups(supabase: Supabase, instanceId: string) {
  const { data } = await supabase
    .from("backups")
    .select(
      "id, path, size, n8n_version_id, workflow(instance, id, n8n_workflow_id), workspace"
    )
    .eq("workflow.instance", instanceId)
    .throwOnError();

  logger.info(`${data.length} existing backups fetched`, {
    instanceId,
  });

  return data as ExistingBackup[];
}

async function getWorkflows(supabase: Supabase, instanceId: string) {
  const { data } = await supabase
    .from("workflows")
    .select("id, n8n_workflow_id, n8n_version_id")
    .eq("instance", instanceId)
    .throwOnError();

  logger.info(`${data.length} workflows fetched`, {
    instanceId,
  });

  return data as DbWorkflow[];
}

function generateBackupFileName(
  workflowName: string,
  versionId: string,
  timestamp: Date = new Date()
): string {
  const timestampStr = timestamp
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, -5); // 2025-01-15T14-30-22
  const nameSlug = workflowName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50); // Limit length
  const versionShort = versionId.slice(0, 8); // First 8 chars of UUID

  return `${timestampStr}-${nameSlug}-v${versionShort}.json`;
}

async function createBackup(
  supabase: Supabase,
  instanceId: string,
  workspaceId: string,
  workflow: Workflow
) {
  if (!(workflow.id && workflow.versionId)) {
    logger.error("Workflow ID and version ID are required", {
      instanceId,
      workflow,
    });
    return;
  }

  const blob = new Blob([JSON.stringify(workflow, null, 2)], {
    type: "application/json",
  });

  const id = crypto.randomUUID();
  const path = `${workspaceId}/${instanceId}/${workflow.id}/${generateBackupFileName(workflow.name, workflow.versionId)}`;
  const size = blob.size;

  const { data: dbWorkflow } = await supabase
    .from("workflows")
    .select("id, n8n_version_id")
    .eq("instance", instanceId)
    .eq("n8n_workflow_id", workflow.id)
    .single()
    .throwOnError();

  if (!dbWorkflow) {
    logger.error(`Workflow ${workflow.id} not found`, {
      instanceId,
      workflowId: workflow.id,
    });
    return;
  }

  await supabase
    .from("backups")
    .insert({
      id,
      path,
      size,
      n8n_version_id: workflow.versionId,
      workflow: dbWorkflow.id,
      workspace: workspaceId,
    })
    .throwOnError();

  const { error } = await supabase.storage.from("backups").upload(path, blob, {
    contentType: "application/json",
    upsert: false,
  });

  if (error) {
    logger.error("Failed to upload backup", {
      instanceId,
      workflowId: workflow.id,
      error,
    });
    return;
  }
}

function calculateBackupsDiff(
  instanceId: string,
  existingBackups: ExistingBackup[],
  n8nWorkflows: Workflow[],
  dbWorkflows: DbWorkflow[]
) {
  const dbWorkflowsMap = new Map(
    dbWorkflows.map((w) => [w.n8n_workflow_id, w])
  );

  const existingBackupsMap = new Map<string, ExistingBackup>();
  for (const backup of existingBackups) {
    const key = `${backup.workflow.id}:${backup.n8n_version_id}`;
    existingBackupsMap.set(key, backup);
  }

  const toCreate: Workflow[] = [];

  for (const workflow of n8nWorkflows) {
    if (!(workflow.id && workflow.versionId)) {
      continue;
    }

    const dbWorkflow = dbWorkflowsMap.get(workflow.id);
    if (!dbWorkflow) {
      logger.warn(`Workflow ${workflow.id} not found in database`, {
        instanceId,
        workflowId: workflow.id,
      });
      continue;
    }

    const backupKey = `${dbWorkflow.id}:${workflow.versionId}`;
    const existingBackup = existingBackupsMap.get(backupKey);

    if (!existingBackup) {
      toCreate.push(workflow);
    }
  }

  return toCreate;
}
