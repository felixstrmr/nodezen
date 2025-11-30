import { createClient } from "@supabase/supabase-js";
import { schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import { createSyncContext } from "@/tasks/shared/sync-base";
import { syncExecutions } from "@/tasks/shared/sync-executions";
import { syncWorkflows } from "@/tasks/shared/sync-workflows";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstanceTask = schemaTask({
  id: "sync-instance-task",
  schema: z.object({
    instanceId: z
      .string("Invalid instance ID")
      .min(1, "Instance ID is required"),
  }),
  run: async (payload) => {
    const { instanceId } = payload;

    const { data: instance } = await supabase
      .from("instances")
      .select("id, n8n_url, n8n_api_key, workspace!inner(id, subscription)")
      .eq("id", instanceId)
      .maybeSingle()
      .throwOnError();

    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`);
    }

    const context = await createSyncContext(supabase, instance);

    const [workflowResult, executionResult] = await Promise.allSettled([
      syncWorkflows(context),
      syncExecutions(context, { limit: 1000 }),
    ]);

    if (workflowResult.status === "rejected") {
      throw workflowResult.reason;
    }

    if (executionResult.status === "rejected") {
      throw executionResult.reason;
    }

    return {
      workflows: workflowResult.value,
      executions: executionResult.value,
    };
  },
});
