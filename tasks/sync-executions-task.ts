import { createClient } from "@supabase/supabase-js";
import { logger, schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database, Enums } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncExecutionsTask = schemaTask({
  id: "sync-executions-task",
  schema: z.object({
    workspaceId: z.uuid().min(1),
  }),
  run: async (payload) => {
    const { workspaceId } = payload;

    const startTime = Date.now();
    let totalSynced = 0;
    let totalErrors = 0;

    try {
      const { data: instances } = await supabase
        .from("instances")
        .select("*")
        .eq("status", "connected")
        .eq("workspace", workspaceId)
        .throwOnError();

      if (!instances || instances.length === 0) {
        logger.info("No connected instances found to sync");
        return { synced: 0, errors: 0 };
      }

      for (const instance of instances) {
        try {
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

          if (!workflows || workflows.length === 0) {
            logger.info(`No workflows found for instance ${instance.id}`);
            continue;
          }

          for (const workflow of workflows) {
            try {
              const { data: existingExecutions } = await supabase
                .from("executions")
                .select("n8n_execution_id")
                .eq("workflow", workflow.id);

              const existingIds = new Set(
                existingExecutions?.map((e) => e.n8n_execution_id) || []
              );

              const executions = await client.getExecutionsByWorkflowId(
                workflow.n8n_workflow_id
              );

              const newExecutions = executions.filter(
                (execution) => !existingIds.has(execution.id)
              );

              if (newExecutions.length === 0) {
                logger.debug(
                  `No new executions for workflow ${workflow.n8n_workflow_id}`
                );
                continue;
              }

              const executionsToInsert = newExecutions.map((execution) => ({
                mode: execution.mode as Enums<"execution_modes">,
                n8n_execution_id: execution.id,
                started_at: execution.startedAt,
                status: execution.status as Enums<"execution_statuses">,
                stopped_at: execution.stoppedAt,
                workflow: workflow.id,
                workspace: instance.workspace,
              })) as Database["public"]["Tables"]["executions"]["Insert"][];

              const BATCH_SIZE = 100;
              for (let i = 0; i < executionsToInsert.length; i += BATCH_SIZE) {
                const batch = executionsToInsert.slice(i, i + BATCH_SIZE);
                const { error: insertError } = await supabase
                  .from("executions")
                  .insert(batch);

                if (insertError) {
                  logger.error(
                    `Failed to insert executions for workflow ${workflow.id}`,
                    { error: insertError }
                  );
                  totalErrors += 1;
                } else {
                  totalSynced += batch.length;
                }
              }

              logger.info(
                `Synced ${newExecutions.length} executions for workflow ${workflow.n8n_workflow_id}`
              );
            } catch (workflowError) {
              logger.error(
                `Error syncing workflow ${workflow.n8n_workflow_id}`,
                { error: workflowError }
              );
              totalErrors += 1;
            }
          }
        } catch (instanceError) {
          logger.error(`Error processing instance ${instance.id}`, {
            error: instanceError,
          });
          totalErrors += 1;
        }
      }

      const duration = Date.now() - startTime;
      logger.info(
        `Sync completed: ${totalSynced} executions synced, ${totalErrors} errors in ${duration}ms`
      );

      return { synced: totalSynced, errors: totalErrors, duration };
    } catch (error) {
      logger.error("Fatal error in sync executions task", { error });
      throw error;
    }
  },
});
