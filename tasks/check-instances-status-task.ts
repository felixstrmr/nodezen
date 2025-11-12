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

    for (const instance of instances) {
      const client = new n8nClient(instance.url, instance.api_key);
      const isConnected = await client.testConnection();

      if (!isConnected) {
        await supabase
          .from("instances")
          .update({
            status: "disconnected",
            last_status_check_at: new Date().toISOString(),
          })
          .eq("id", instance.id);

        console.log(`Instance ${instance.id} is disconnected`);
        continue;
      }

      await supabase
        .from("instances")
        .update({
          status: "connected",
          last_status_check_at: new Date().toISOString(),
        })
        .eq("id", instance.id);

      console.log(`Instance ${instance.id} is connected`);
    }
  },
});
