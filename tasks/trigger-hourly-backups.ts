import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { createWorkflowBackupsTask } from "@/tasks/create-workflow-backups-task";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const triggerHourlyBackups = schedules.task({
  id: "trigger-hourly-backups",
  run: async () => {
    const { data: workspaces } = await supabase
      .from("workspaces")
      .select("id")
      .eq("subscription", "premium")
      .throwOnError();

    for (const workspace of workspaces) {
      createWorkflowBackupsTask.trigger({ workspaceId: workspace.id });
    }
  },
});
