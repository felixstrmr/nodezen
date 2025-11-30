import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import type { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";

export async function syncInstanceStatus(
  supabase: SupabaseClient<Database>,
  instanceId: string,
  client: n8nClient
) {
  const status = await client.getStatus();

  logger.info(`Checking instance ${instanceId} status...`, {
    instanceId,
  });

  await supabase
    .from("instances")
    .update({
      status,
      last_status_check_at: new Date().toISOString(),
    })
    .eq("id", instanceId)
    .throwOnError();

  if (status === "disconnected") {
    logger.warn("Instance is disconnected. Skipping...", {
      instanceId,
    });
    return false;
  }

  logger.info("Instance is connected. Continuing...", {
    instanceId,
  });

  return true;
}
