import { createClient } from "@supabase/supabase-js";
import { schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const checkInstancesStatus = schedules.task({
  id: "check-instances-status",
  run: async () => {
    const { data: instances } = await supabase
      .from("instances")
      .select("*")
      .throwOnError();

    for (const instance of instances) {
      const decryptedApiKey = await decrypt(
        instance.api_key,
        process.env.ENCRYPTION_SECRET as string
      );

      const client = new n8nClient(instance.url, decryptedApiKey);
      const isConnected = await client.testConnection();

      const status = isConnected ? "connected" : "disconnected";
      await supabase
        .from("instances")
        .update({ status, last_status_check_at: new Date().toISOString() })
        .eq("id", instance.id)
        .throwOnError();
    }
  },
});
