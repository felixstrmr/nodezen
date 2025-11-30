import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@trigger.dev/sdk";
import type { Database } from "@/types/supabase";
import { createN8nClient } from "./create-n8n-client";
import { InstanceConnectionError, SyncOperationError } from "./errors";
import { syncInstanceStatus } from "./sync-instance-status";
import type { SyncContext, SyncInstance, SyncOptions } from "./types";

/**
 * Default sync options
 */
const DEFAULT_SYNC_OPTIONS: Required<SyncOptions> = {
  batchSize: 100,
};

/**
 * Creates a sync context for an instance
 */
export async function createSyncContext(
  supabase: SupabaseClient<Database>,
  instance: SyncInstance
): Promise<SyncContext> {
  const client = await createN8nClient(instance.n8n_url, instance.n8n_api_key);

  const isConnected = await syncInstanceStatus(supabase, instance.id, client);

  if (!isConnected) {
    throw new InstanceConnectionError(instance.id);
  }

  return {
    instance,
    supabase,
    client,
  };
}

/**
 * Executes a sync operation with proper error handling and logging
 */
export async function executeSyncOperation<T>(
  operation: string,
  context: SyncContext,
  fn: (ctx: SyncContext) => Promise<T>
): Promise<T> {
  const { instance } = context;

  logger.info(`Starting ${operation}`, {
    instanceId: instance.id,
    workspaceId: instance.workspace.id,
  });

  try {
    const result = await fn(context);

    logger.info(`Completed ${operation}`, {
      instanceId: instance.id,
    });

    return result;
  } catch (error) {
    logger.error(`Failed ${operation}`, {
      instanceId: instance.id,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new SyncOperationError(
      `Failed to ${operation}`,
      instance.id,
      operation,
      error
    );
  }
}

/**
 * Updates the last sync timestamp for an instance
 */
export async function updateLastSyncTimestamp(
  supabase: SupabaseClient<Database>,
  instanceId: string,
  field: "last_workflow_sync_at" | "last_execution_sync_at"
): Promise<void> {
  await supabase
    .from("instances")
    .update({
      [field]: new Date().toISOString(),
    })
    .eq("id", instanceId)
    .throwOnError();

  logger.info(`Updated ${field}`, {
    instanceId,
  });
}

/**
 * Merges sync options with defaults
 */
export function mergeSyncOptions(options?: SyncOptions): Required<SyncOptions> {
  return { ...DEFAULT_SYNC_OPTIONS, ...options };
}
