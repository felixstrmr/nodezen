import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import { createWorkflowBackupsTask } from "@/tasks/create-workflow-backups-task";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const triggerBackupsTask = schedules.task({
  id: "trigger-backups-task",
  run: async ({ timestamp }) => {
    logger.info("Starting backups trigger task", {
      timestamp: timestamp.toISOString(),
      hour: timestamp.getHours(),
      minute: timestamp.getMinutes(),
    });

    const { data: workspaces } = await supabase
      .from("workspaces")
      .select("id, subscription")
      .in("subscription", ["pro", "premium"])
      .throwOnError();

    for (const workspace of workspaces) {
      if (workspace.subscription === "premium") {
        createWorkflowBackupsTask.trigger({ workspaceId: workspace.id });
      } else if (
        workspace.subscription === "pro" &&
        timestamp.getHours() === 0 &&
        timestamp.getMinutes() === 0
      ) {
        createWorkflowBackupsTask.trigger({ workspaceId: workspace.id });
      }
    }
  },
});
