import { createClient } from "@supabase/supabase-js";
import { logger, schedules } from "@trigger.dev/sdk";
import { n8nClient } from "@/lib/clients/n8n-client";
import type { Database } from "@/types/supabase";
import { decrypt } from "@/utils/encryption";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

async function checkInstanceWithRetry(
  instance: Database["public"]["Tables"]["instances"]["Row"],
  retries = MAX_RETRIES
): Promise<{ status: "connected" | "disconnected"; error?: string }> {
  try {
    const decryptedApiKey = await decrypt(
      instance.api_key,
      process.env.ENCRYPTION_SECRET as string
    );

    const client = new n8nClient(instance.url, decryptedApiKey);
    const isConnected = await client.testConnection();

    return { status: isConnected ? "connected" : "disconnected" };
  } catch (error) {
    if (retries > 0) {
      logger.warn(
        `Connection check failed for instance ${instance.id}, retrying... (${retries} retries left)`,
        { error }
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return checkInstanceWithRetry(instance, retries - 1);
    }

    logger.error(`Connection check failed for instance ${instance.id}`, {
      error,
    });
    return {
      status: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const checkInstancesStatus = schedules.task({
  id: "check-instances-status",
  run: async () => {
    const startTime = Date.now();

    try {
      const { data: instances } = await supabase
        .from("instances")
        .select("*")
        .throwOnError();

      if (!instances || instances.length === 0) {
        logger.info("No instances found to check");
        return { checked: 0, connected: 0, disconnected: 0 };
      }

      // Check all instances concurrently with controlled concurrency
      const CONCURRENCY_LIMIT = 5;
      const results: {
        id: string;
        status: "connected" | "disconnected";
        statusChanged: boolean;
        error?: string;
      }[] = [];

      for (let i = 0; i < instances.length; i += CONCURRENCY_LIMIT) {
        const batch = instances.slice(i, i + CONCURRENCY_LIMIT);
        const batchResults = await Promise.all(
          batch.map(async (instance) => {
            const result = await checkInstanceWithRetry(instance);

            // Detect status changes
            const statusChanged = instance.status !== result.status;
            const now = new Date().toISOString();

            const updateData: Database["public"]["Tables"]["instances"]["Update"] =
              {
                status: result.status,
                last_status_check_at: now,
              };

            // Track when status changes occur
            if (statusChanged) {
              updateData.last_status_check_at = now;
              logger.info(
                `Instance ${instance.id} status changed: ${instance.status} → ${result.status}`
              );
            }

            const { error: updateError } = await supabase
              .from("instances")
              .update(updateData)
              .eq("id", instance.id);

            if (updateError) {
              logger.error(`Failed to update instance ${instance.id}`, {
                error: updateError,
              });
            }

            return {
              id: instance.id,
              status: result.status,
              statusChanged,
              error: result.error,
            };
          })
        );

        results.push(...batchResults);
      }

      const connectedCount = results.filter(
        (r) => r.status === "connected"
      ).length;
      const disconnectedCount = results.filter(
        (r) => r.status === "disconnected"
      ).length;
      const statusChanges = results.filter((r) => r.statusChanged).length;
      const duration = Date.now() - startTime;

      logger.info(
        `Status check completed: ${connectedCount} connected, ${disconnectedCount} disconnected, ${statusChanges} status changes in ${duration}ms`
      );

      return {
        checked: instances.length,
        connected: connectedCount,
        disconnected: disconnectedCount,
        statusChanges,
        duration,
      };
    } catch (error) {
      logger.error("Fatal error in check instances status task", { error });
      throw error;
    }
  },
});
