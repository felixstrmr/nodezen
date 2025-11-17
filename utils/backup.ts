import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Node, Workflow } from "@/types/n8n";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

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

async function hasNodesChanged(
  workflowId: string,
  currentWorkflowData: Workflow,
  supabaseClient: SupabaseClient<Database>
): Promise<boolean> {
  const { data: latestBackup } = await supabaseClient
    .from("backups")
    .select("id, path")
    .eq("workflow", workflowId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestBackup) {
    return true;
  }

  try {
    const { data: backupFile, error: downloadError } =
      await supabaseClient.storage.from("backups").download(latestBackup.path);

    if (downloadError) {
      logger.warn(
        `Failed to download latest backup for workflow ${workflowId}: ${downloadError.message}`
      );
      return true;
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
    return true;
  }
}

export async function triggerBackup(
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
  const decrpytedApiKey = await decrypt(
    instance.api_key,
    process.env.ENCRYPTION_SECRET as string
  );
  const client = new n8nClient(instance.url, decrpytedApiKey);

  // Fetch workflows from n8n
  const n8nWorkflows = await client.getWorkflows();
  const activeN8nWorkflows = n8nWorkflows.filter(
    (workflow) => workflow.id && !workflow.isArchived
  );

  // Get existing workflows from Supabase
  const { data: supabaseWorkflows } = await supabase
    .from("workflows")
    .select("id, n8n_workflow_id")
    .eq("instance", instance.id)
    .throwOnError();

  // Create a map of n8n_workflow_id to Supabase workflow
  const workflowMap = new Map(
    supabaseWorkflows?.map((w) => [w.n8n_workflow_id, w]) || []
  );

  // Process backups for matched workflows
  for (const n8nWorkflow of activeN8nWorkflows) {
    if (!n8nWorkflow.id) {
      continue;
    }

    const supabaseWorkflow = workflowMap.get(n8nWorkflow.id);
    if (!supabaseWorkflow) {
      logger.warn(
        `No Supabase workflow found for n8n workflow ${n8nWorkflow.id}`
      );
      continue;
    }

    // Get full workflow data from n8n
    const workflowData = await client.getWorkflowById(n8nWorkflow.id);

    if (!workflowData) {
      logger.error(`Workflow data not found for workflow ${n8nWorkflow.id}`);
      continue;
    }

    // Check if nodes have changed compared to the latest backup
    const nodesChanged = await hasNodesChanged(
      supabaseWorkflow.id,
      workflowData,
      supabase
    );

    if (!nodesChanged) {
      logger.info(
        `Skipping backup for workflow ${supabaseWorkflow.id} - nodes unchanged`
      );
      continue;
    }

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });

    const id = crypto.randomUUID();
    const path = `${instance.workspace.id}/${instance.id}/${supabaseWorkflow.id}/${id}.json`;

    await supabase
      .from("backups")
      .insert({
        id,
        path,
        size_bytes: blob.size,
        workflow: supabaseWorkflow.id,
        workspace: instance.workspace.id,
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
