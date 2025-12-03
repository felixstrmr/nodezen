import { createClient } from "@supabase/supabase-js";
import { schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import { syncExecutions } from "@/tasks/shared/sync-executions";
import { syncWorkflows } from "@/tasks/shared/sync-workflows";
import type { Database } from "@/types/supabase";

const supabase = await createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstanceTask = schemaTask({
  id: "sync-instance-task",
  schema: z.object({
    instanceId: z.string().min(1),
  }),
  run: async ({ instanceId }) => {
    const { data: instance } = await supabase
      .from("instances")
      .select("id, n8n_url, n8n_api_key, workspace!inner(id, subscription)")
      .eq("id", instanceId)
      .maybeSingle()
      .throwOnError();

    if (!instance) {
      throw new Error("Instance not found");
    }

    await syncWorkflows(supabase, instanceId, instance.workspace.id);
    await syncExecutions(supabase, instanceId, instance.workspace.id);
  },
});
