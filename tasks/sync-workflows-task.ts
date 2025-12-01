import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import { syncWorkflows } from "@/tasks/shared/sync-workflows";
import type { Database } from "@/types/supabase";

const supabase = await createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncWorkflowsTask = schedules.task({
  id: "sync-workflows-task",
  run: async ({ externalId }) => {
    if (
      externalId !== "free" &&
      externalId !== "pro" &&
      externalId !== "ultra"
    ) {
      throw new Error("Invalid external ID");
    }

    const { data: instances } = await supabase
      .from("instances")
      .select("id, n8n_url, n8n_api_key, workspace!inner(id, subscription)")
      .eq("workspace.subscription", externalId)
      .eq("status", "connected")
      .throwOnError();

    logger.info(`Found ${instances.length} instances`, {
      externalId,
    });

    await Promise.allSettled(
      instances.map((instance) =>
        syncWorkflows(supabase, instance.id, instance.workspace.id)
      )
    );
  },
});
