import { logger } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Supabase } from "@/types";
import { decrypt } from "@/utils/encryption";

export async function createInstanceContext(
  supabase: Supabase,
  instanceId: string
) {
  const { data: instance } = await supabase
    .from("instances")
    .select("id, n8n_url, n8n_api_key, workspace!inner(id, subscription)")
    .eq("id", instanceId)
    .maybeSingle()
    .throwOnError();

  if (!instance) {
    throw new Error("Instance not found");
  }

  const decryptedApiKey = await decrypt(instance.n8n_api_key);
  const client = new n8nClient(instance.n8n_url, decryptedApiKey);

  const status = await client.getStatus();
  const isConnected = status === "connected";

  await supabase
    .from("instances")
    .update({
      status,
      last_status_check_at: new Date().toISOString(),
    })
    .eq("id", instanceId)
    .throwOnError();

  if (!isConnected) {
    logger.warn(`Instance ${instanceId} is not connected`, {
      instanceId,
    });
    throw new Error("Instance is not connected");
  }

  logger.info(`Instance ${instanceId} is connected`, {
    instanceId,
  });

  return {
    client,
    instance,
  };
}
