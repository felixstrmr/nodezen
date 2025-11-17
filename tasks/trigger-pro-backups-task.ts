import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import type { Database } from "@/types/supabase";
import { triggerBackup } from "@/utils/backup";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const triggerProBackupsTask = schedules.task({
  id: "trigger-pro-backups-task",
  machine: "micro",
  run: async () => {
    logger.info("Starting trigger pro backups task", {
      timestamp: new Date().toISOString(),
    });

    const { data: instances } = await supabase
      .from("instances")
      .select("id, url, api_key, workspace!inner(id, subscription)")
      .eq("workspace.subscription", "pro")
      .throwOnError();

    logger.info(`Found ${instances.length} instances to trigger backups for`);

    await Promise.all(
      instances.map((instance) => triggerBackup(supabase, instance))
    );
  },
});
