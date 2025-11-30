import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { getInstances } from "@/tasks/shared/get-instances";
import { createSyncContext } from "@/tasks/shared/sync-base";
import { syncWorkflows } from "@/tasks/shared/sync-workflows";
import type { WorkspaceSubscription } from "@/types";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncWorkflowsTask = schedules.task({
  id: "sync-workflows-task",
  run: async ({ externalId }) => {
    const workspaceSubscription = externalId as WorkspaceSubscription;

    const instances = await getInstances(supabase, workspaceSubscription);

    if (instances.length === 0) {
      return;
    }

    const results = await Promise.allSettled(
      instances.map(async (instance) => {
        const context = await createSyncContext(supabase, instance);
        return await syncWorkflows(context);
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
      console.error(
        `Workflow sync completed with ${failed} failures out of ${instances.length} instances`
      );
    }

    console.log(
      `Workflow sync completed with ${successful} successes and ${failed} failures out of ${instances.length} instances`
    );
  },
});
