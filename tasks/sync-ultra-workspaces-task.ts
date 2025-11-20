import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import type { Database } from "@/types/supabase";
import { syncInstance } from "@/utils/task";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncUltraWorkspacesTask = schedules.task({
  id: "sync-ultra-workspaces-task",
  machine: "micro",
  run: async () => {
    logger.info("Starting sync ultra workspaces task", {
      timestamp: new Date().toISOString(),
    });

    const { data: instances } = await supabase
      .from("instances")
      .select("id, url, api_key, workspace!inner(id, subscription)")
      .eq("workspace.subscription", "ultra")
      .throwOnError();

    logger.info(`Found ${instances.length} instances to sync`);

    await Promise.all(
      instances.map((instance) => syncInstance(supabase, instance))
    );
  },
});
