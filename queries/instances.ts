import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getInstances(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`instances:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("instances")
    .select("id, name, description, n8n_url, n8n_api_key, workspace!inner(id)")
    .order("created_at", { ascending: false })
    .eq("workspace", workspaceId);

  if (error) {
    return { instances: [], error };
  }

  return { instances: data, error: null };
}
