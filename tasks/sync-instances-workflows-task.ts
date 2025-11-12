import { createClient } from "@supabase/supabase-js";
import { task } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstancesWorkflowsTask = task({
  id: "sync-instances-workflows-task",
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

      const workflows = await client.getWorkflows();

      for (const workflow of workflows) {
        if (!workflow.id) {
          continue;
        }

        const lastExecution = await client.getLastExecutionByWorkflowId(
          workflow.id
        );

        const { data: existingWorkflow } = await supabase
          .from("workflows")
          .select("*")
          .eq("n8n_workflow_id", workflow.id)
          .maybeSingle()
          .throwOnError();

        if (existingWorkflow) {
          await supabase
            .from("workflows")
            .update({
              name: workflow.name,
              is_active: workflow.active,
              is_archived: workflow.isArchived,
              last_execution_at: lastExecution?.startedAt ?? null,
              last_execution_status: lastExecution?.status ?? null,
              updated_at: new Date().toISOString(),
              n8n_updated_at: workflow.updatedAt ?? null,
            })
            .eq("id", existingWorkflow.id);
          console.log(`Workflow ${workflow.id} is synced`);
        } else {
          await supabase
            .from("workflows")
            .insert({
              name: workflow.name,
              instance_id: instance.id,
              n8n_workflow_id: workflow.id,
              is_active: workflow.active,
              is_archived: workflow.isArchived,
              last_execution_at: lastExecution?.startedAt ?? null,
              last_execution_status: lastExecution?.status ?? null,
              n8n_updated_at: workflow.updatedAt ?? null,
              n8n_created_at: workflow.createdAt ?? null,
            })
            .throwOnError();
          console.log(`Workflow ${workflow.id} is created`);
        }
      }
    }
  },
});
