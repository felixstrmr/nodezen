import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getBackups(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`backups:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("backups")
    .select("*, workflow(id, name, instance(id, name))")
    .eq("workspace", workspaceId);

  if (error) {
    return { backups: [], error };
  }

  return { backups: data, error: null };
}
