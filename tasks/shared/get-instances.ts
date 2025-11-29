import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkspaceSubscription } from "@/types";
import type { Database } from "@/types/supabase";

export async function getInstances(
  supabase: SupabaseClient<Database>,
  subscription: WorkspaceSubscription
) {
  const { data } = await supabase
    .from("instances")
    .select("id, n8n_url, n8n_api_key, workspace!inner(id, subscription)")
    .eq("workspace.subscription", subscription)
    .throwOnError();

  return data;
}
