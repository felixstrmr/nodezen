// tasks/sync-all-workspaces-task.ts
import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Supabase } from "@/types";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstancesDataTask = schedules.task({
  id: "sync-instances-data-task",
  run: async (payload) => {
    const { externalId } = payload;

    if (!externalId) {
      throw new Error("External ID is required");
    }

    logger.info("Starting sync task", {
      timestamp: new Date().toISOString(),
      externalId,
    });

    let query = supabase
      .from("instances")
      .select("id, url, api_key, workspace!inner(id, subscription)");

    if (externalId !== "all") {
      query = query.eq("workspace.subscription", externalId);
    }

    const { data: instances } = await query.throwOnError();

    logger.info(`Found ${instances.length} instances to sync`);

    await Promise.allSettled(
      instances.map((instance) =>
        syncInstance(supabase, instance.id, instance.url, instance.api_key)
      )
    );
  },
});

async function syncInstance(
  supabaseClient: Supabase,
  instanceId: string,
  instanceUrl: string,
  instanceApiKey: string
) {
  const decrpytedApiKey = await decrypt(
    instanceApiKey,
    process.env.ENCRYPTION_SECRET as string
  );

  const client = new n8nClient(instanceUrl, decrpytedApiKey);
  const isConnected = await client.testConnection();
  const status = isConnected ? "connected" : "disconnected";

  await supabaseClient
    .from("instances")
    .update({ status, last_synced_at: new Date().toISOString() })
    .eq("id", instanceId)
    .throwOnError();

  if (!isConnected) {
    logger.info(`Instance ${instanceId} is disconnected, skipping`);
    return;
  }
}

function syncWorkflow() {
  return;
}

function syncExecution() {
  return;
}
