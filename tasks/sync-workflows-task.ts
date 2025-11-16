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

export const syncWorkflowsTask = schemaTask({
  id: "sync-workflows-task",
  schema: z.object({
    workspaceId: z.uuid().min(1),
  }),
  run: async (payload) => {
    const { workspaceId } = payload;

    const startTime = Date.now();
    let totalSynced = 0;
    let totalUpdated = 0;
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
        return { synced: 0, updated: 0, errors: 0 };
      }

      for (const instance of instances) {
        try {
          const decryptedApiKey = await decrypt(
            instance.api_key,
            process.env.ENCRYPTION_SECRET as string
          );

          const client = new n8nClient(instance.url, decryptedApiKey);

          const workflows = await client.getWorkflows();

          const activeWorkflows = workflows.filter(
            (workflow) => workflow.id && !workflow.isArchived
          );

          if (activeWorkflows.length === 0) {
            logger.info(
              `No active workflows found for instance ${instance.id}`
            );
            continue;
          }

          const { data: existingWorkflows } = await supabase
            .from("workflows")
            .select("n8n_workflow_id")
            .eq("instance", instance.id);

          const existingWorkflowIds = new Set(
            existingWorkflows?.map((w) => w.n8n_workflow_id) || []
          );

          for (const workflow of activeWorkflows) {
            try {
              const lastExecution = await client.getLastExecutionByWorkflowId(
                workflow.id || ""
              );

              const workflowData: Database["public"]["Tables"]["workflows"]["Insert"] =
                {
                  instance: instance.id,
                  name: workflow.name,
                  is_active: workflow.active,
                  n8n_workflow_id: workflow.id || "",
                  workspace: instance.workspace,
                  last_execution_at: lastExecution?.startedAt || null,
                  last_execution_status: lastExecution?.status || null,
                };

              const { error: upsertError } = await supabase
                .from("workflows")
                .upsert(workflowData, {
                  onConflict: "instance,n8n_workflow_id",
                  ignoreDuplicates: false,
                })
                .throwOnError();

              if (upsertError) {
                logger.error(
                  `Failed to upsert workflow ${workflow.id} for instance ${instance.id}`,
                  { error: upsertError }
                );
                totalErrors += 1;
              } else if (existingWorkflowIds.has(workflow.id || "")) {
                totalUpdated += 1;
                logger.debug(
                  `Updated workflow ${workflow.id || ""} (${workflow.name})`
                );
              } else {
                totalSynced += 1;
                logger.info(
                  `Created new workflow ${workflow.id || ""} (${workflow.name})`
                );
              }
            } catch (workflowError) {
              logger.error(`Error syncing workflow ${workflow.id || ""}`, {
                error: workflowError,
              });
              totalErrors += 1;
            }
          }

          const currentWorkflowIds = new Set(
            activeWorkflows.map((w) => w.id || "")
          );
          const workflowsToArchive = Array.from(existingWorkflowIds).filter(
            (id) => !currentWorkflowIds.has(id)
          );

          if (workflowsToArchive.length > 0) {
            const { error: archiveError } = await supabase
              .from("workflows")
              .update({ is_active: false })
              .eq("instance", instance.id)
              .in("n8n_workflow_id", workflowsToArchive);

            if (archiveError) {
              logger.error(
                `Failed to archive removed workflows for instance ${instance.id}`,
                { error: archiveError }
              );
            } else {
              logger.info(
                `Archived ${workflowsToArchive.length} workflows no longer in n8n for instance ${instance.id}`
              );
            }
          }

          logger.info(
            `Instance ${instance.id}: ${totalSynced} new, ${totalUpdated} updated, ${workflowsToArchive.length} archived`
          );
        } catch (instanceError) {
          logger.error(`Error processing instance ${instance.id}`, {
            error: instanceError,
          });
          totalErrors += 1;
        }
      }

      const duration = Date.now() - startTime;
      logger.info(
        `Workflow sync completed: ${totalSynced} created, ${totalUpdated} updated, ${totalErrors} errors in ${duration}ms`
      );

      return {
        synced: totalSynced,
        updated: totalUpdated,
        errors: totalErrors,
        duration,
      };
    } catch (error) {
      logger.error("Fatal error in sync workflows task", { error });
      throw error;
    }
  },
});
