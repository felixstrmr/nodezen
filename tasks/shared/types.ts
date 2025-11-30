import type { WorkspaceSubscription } from "@/types";
import type { Database } from "@/types/supabase";

/**
 * Instance type used across sync tasks
 */
export type SyncInstance = {
  id: string;
  n8n_url: string;
  n8n_api_key: string;
  workspace: {
    id: string;
    subscription: WorkspaceSubscription;
  };
};

/**
 * Context passed to sync operations
 */
export type SyncContext = {
  instance: SyncInstance;
  supabase: import("@supabase/supabase-js").SupabaseClient<Database>;
  client: import("@/lib/clients/n8n-client").n8nClient;
};

/**
 * Result of a sync operation
 */
export type SyncResult = {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  errors: Array<{ message: string; error: unknown }>;
};

/**
 * Options for sync operations
 */
export type SyncOptions = {
  batchSize?: number;
};
