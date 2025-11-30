import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkflows(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workflows:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("workflows")
    .select(
      "id, name, n8n_workflow_id, is_active, instance!inner(id, name), workspace!inner(id)"
    )
    .order("created_at", { ascending: false })
    .eq("workspace", workspaceId);

  if (error) {
    return { workflows: [], error };
  }

  return { workflows: data, error: null };
}
