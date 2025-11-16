import { createClient } from "@supabase/supabase-js";
import { logger, schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

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
