import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database, Enums } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncExecutionsTask = schedules.task({
  id: "sync-executions-task",
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

      const { data: workflows } = await supabase
        .from("workflows")
        .select("id, n8n_workflow_id")
        .eq("instance", instance.id)
        .throwOnError();

      for (const workflow of workflows) {
        const executions = await client.getExecutionsByWorkflowId(
          workflow.n8n_workflow_id
        );

        const executionsToInsert = executions.map((execution) => ({
          mode: execution.mode as Enums<"execution_modes">,
          n8n_execution_id: execution.id,
          started_at: execution.startedAt,
          status: execution.status as Enums<"execution_statuses">,
          stopped_at: execution.stoppedAt,
          workflow: workflow.id,
          workspace: instance.workspace,
        })) as Database["public"]["Tables"]["executions"]["Insert"][];

        await supabase
          .from("executions")
          .insert(executionsToInsert)
          .throwOnError();
      }
    }
  },
});
