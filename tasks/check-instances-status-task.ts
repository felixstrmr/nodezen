import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const checkInstancesStatusTask = schedules.task({
  id: "check-instances-status-task",
  run: async () => {
    const { data: instances } = await supabase
      .from("instances")
      .select("*")
      .throwOnError();

    const results = await Promise.allSettled(
      instances.map(async (instance) => {
        const client = new n8nClient(instance.url, instance.api_key);
        const isConnected = await client.testConnection();

        return {
          id: instance.id,
          status: isConnected ? "connected" : "disconnected",
        };
      })
    );

    const now = new Date().toISOString();
    const updatePromises = results.map((result, index) => {
      const instance = instances[index];

      if (result.status === "fulfilled") {
        const { status } = result.value;
        console.log(`Instance ${instance.id} is ${status}`);

        return supabase
          .from("instances")
          .update({
            status: status as Database["public"]["Enums"]["instance_statuses"],
            last_status_check_at: now,
          })
          .eq("id", instance.id);
      }
      console.error(`Failed to check instance ${instance.id}:`, result.reason);

      return supabase
        .from("instances")
        .update({
          status: "disconnected",
          last_status_check_at: now,
        })
        .eq("id", instance.id);
    });

    await Promise.allSettled(updatePromises);
  },
});
