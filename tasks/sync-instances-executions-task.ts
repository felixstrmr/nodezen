import { createClient } from "@supabase/supabase-js";
import { task } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstancesExecutionsTask = task({
  id: "sync-instances-executions-task",
  run: async () => {
    const { data: instances } = await supabase
      .from("instances")
      .select("*")
      .throwOnError();

    for (const instance of instances) {
      const client = new n8nClient(instance.url, instance.api_key);
      const isConnected = await client.testConnection();

      if (!isConnected) {
        await supabase
          .from("instances")
          .update({
            status: "disconnected",
            last_status_check_at: new Date().toISOString(),
          })
          .eq("id", instance.id);
        console.log(`Instance ${instance.id} is disconnected`);

        continue;
      }

      await supabase
        .from("instances")
        .update({
          status: "connected",
          last_status_check_at: new Date().toISOString(),
        })
        .eq("id", instance.id);
      console.log(`Instance ${instance.id} is connected`);

      const { data: workflows } = await supabase
        .from("workflows")
        .select("*")
        .eq("instance_id", instance.id)
        .throwOnError();

      for (const workflow of workflows) {
        const executions = await client.getExecutionsByWorkflowId(
          workflow.n8n_workflow_id
        );

        for (const execution of executions) {
          if (!execution.id) {
            continue;
          }

          const { data: existingExecution } = await supabase
            .from("executions")
            .select("*")
            .eq("n8n_execution_id", execution.id)
            .eq("workflow_id", workflow.id)
            .maybeSingle()
            .throwOnError();

          if (existingExecution) {
            continue;
          }

          await supabase
            .from("executions")
            .insert({
              mode: execution.mode,
              n8n_execution_id: execution.id,
              n8n_started_at: execution.startedAt,
              n8n_stopped_at: execution.stoppedAt,
              status: execution.status ?? "error",
              workflow_id: workflow.id,
            })
            .throwOnError();
        }
      }
    }
  },
});
