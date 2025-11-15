import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getInstances(workspaceSlug: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`instances:${workspaceSlug}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("instances")
    .select("*, workspace!inner(slug)")
    .eq("workspace.slug", workspaceSlug)
    .order("created_at", { ascending: true })
    .throwOnError();

  return data;
}
