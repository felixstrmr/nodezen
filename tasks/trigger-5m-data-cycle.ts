import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { checkInstancesStatus } from "@/tasks/check-instances-status";
import { syncExecutionsTask } from "@/tasks/sync-executions-task";
import { syncWorkflowsTask } from "@/tasks/sync-workflows-task";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const trigger5mDataCycle = schedules.task({
  id: "trigger-5m-data-cycle",
  run: async () => {
    const { data: workspaces } = await supabase
      .from("workspaces")
      .select("id")
      .eq("subscription", "pro")
      .throwOnError();

    for (const workspace of workspaces) {
      checkInstancesStatus.trigger({ workspaceId: workspace.id });
      syncWorkflowsTask.trigger({ workspaceId: workspace.id });
      syncExecutionsTask.trigger({ workspaceId: workspace.id });
    }
  },
});
