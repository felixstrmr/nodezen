import { createClient } from "@supabase/supabase-js";
import { logger, schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Node, Workflow } from "@/types/n8n";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

/**
 * Normalizes nodes for comparison by sorting and extracting relevant fields
 */
function normalizeNodes(nodes: Node[]) {
  return [...nodes]
    .sort((a, b) => (a.id || "").localeCompare(b.id || ""))
    .map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      typeVersion: node.typeVersion,
      position: node.position,
      disabled: node.disabled,
      parameters: node.parameters,
      credentials: node.credentials,
    }));
}

/**
 * Checks if workflow nodes have changed compared to the latest backup
 */
async function hasNodesChanged(
  workflowId: string,
  currentWorkflowData: Workflow
): Promise<boolean> {
  const { data: latestBackup } = await supabase
    .from("backups")
    .select("id, path")
    .eq("workflow", workflowId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestBackup) {
    return true; // No previous backup, so nodes have "changed"
  }

  try {
    const { data: backupFile, error: downloadError } = await supabase.storage
      .from("backups")
      .download(latestBackup.path);

    if (downloadError) {
      logger.warn(
        `Failed to download latest backup for workflow ${workflowId}: ${downloadError.message}`
      );
      return true; // Assume changed if download fails
    }

    const backupContent = await backupFile.text();
    const previousWorkflowData = JSON.parse(backupContent) as Workflow;

    const currentNodes = normalizeNodes(currentWorkflowData.nodes);
    const previousNodes = normalizeNodes(previousWorkflowData.nodes || []);

    return JSON.stringify(currentNodes) !== JSON.stringify(previousNodes);
  } catch (error) {
    logger.warn(
      `Error comparing workflow nodes for ${workflowId}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return true; // Assume changed if comparison fails
  }
}

export const createWorkflowBackupsTask = schemaTask({
  id: "create-workflow-backups-task",
  schema: z.object({
    workspaceId: z.uuid().min(1),
  }),
  run: async (payload) => {
    const { workspaceId } = payload;

    const { data: instances } = await supabase
      .from("instances")
      .select("id, url, api_key, workspace")
      .eq("workspace", workspaceId)
      .eq("status", "connected")
      .throwOnError();

    for (const instance of instances) {
      const decryptedApiKey = await decrypt(
        instance.api_key,
        process.env.ENCRYPTION_SECRET as string
      );
      const client = new n8nClient(instance.url, decryptedApiKey);

      const { data: workflows } = await supabase
        .from("workflows")
        .select("id, n8n_workflow_id")
        .eq("instance", instance.id)
        .throwOnError();

      for (const workflow of workflows) {
        const workflowData = await client.getWorkflowById(
          workflow.n8n_workflow_id
        );

        if (!workflowData) {
          logger.error(
            `Workflow data not found for workflow ${workflow.n8n_workflow_id}`
          );
          continue;
        }

        // Check if nodes have changed compared to the latest backup
        const nodesChanged = await hasNodesChanged(workflow.id, workflowData);

        if (!nodesChanged) {
          logger.info(
            `Skipping backup for workflow ${workflow.id} - nodes unchanged`
          );
          continue;
        }

        const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
          type: "application/json",
        });

        const id = crypto.randomUUID();
        const path = `${instance.workspace}/${instance.id}/${workflow.id}/${id}.json`;

        await supabase
          .from("backups")
          .insert({
            id,
            path,
            size: blob.size,
            workflow: workflow.id,
            workspace: instance.workspace,
          })
          .throwOnError();

        const { error: uploadError } = await supabase.storage
          .from("backups")
          .upload(path, blob, {
            contentType: "application/json",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }
      }
    }
  },
});
