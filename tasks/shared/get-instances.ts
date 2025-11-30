import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkspaceSubscription } from "@/types";
import type { Database } from "@/types/supabase";
import type { SyncInstance } from "./types";

export async function getInstances(
  supabase: SupabaseClient<Database>,
  subscription: WorkspaceSubscription
): Promise<SyncInstance[]> {
  const { data } = await supabase
    .from("instances")
    .select(
      "id, n8n_url, n8n_api_key, last_execution_sync_at, workspace!inner(id, subscription)"
    )
    .eq("workspace.subscription", subscription)
    .throwOnError();

  if (!data) {
    return [];
  }

  return data.map((instance) => ({
    id: instance.id,
    n8n_url: instance.n8n_url,
    n8n_api_key: instance.n8n_api_key,
    workspace: {
      id: instance.workspace.id,
      subscription: instance.workspace.subscription,
    },
  }));
}
