import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncWorkflowsTask = schedules.task({
  id: "sync-workflows-task",
  run: async () => {
    const { data: instances } = await supabase
      .from("instances")
      .select("*")
      .throwOnError();

    for (const instance of instances) {
      const decryptedApiKey = await decrypt(
        instance.api_key,
        process.env.ENCRYPTION_SECRET as string
      );

      const client = new n8nClient(instance.url, decryptedApiKey);

      const workflows = await client.getWorkflows();

      for (const workflow of workflows) {
        if (!(workflow.id && !workflow.isArchived)) {
          continue;
        }

        const lastExecution = await client.getLastExecutionByWorkflowId(
          workflow.id
        );

        await supabase
          .from("workflows")
          .upsert(
            {
              instance: instance.id,
              name: workflow.name,
              is_active: workflow.active,
              n8n_workflow_id: workflow.id,
              workspace: instance.workspace,
              last_execution_at: lastExecution?.startedAt,
              last_execution_status: lastExecution?.status,
            },
            {
              onConflict: "instance,n8n_workflow_id",
            }
          )
          .throwOnError();
      }
    }
  },
});
