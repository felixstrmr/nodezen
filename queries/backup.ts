import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export const getBackups = async (workspaceSlug: string) => {
  "use cache: private";
  cacheLife("max");
  cacheTag(`backups:${workspaceSlug}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("backups")
    .select("*, workspace!inner(slug), workflow(id, name)")
    .eq("workspace.slug", workspaceSlug)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data ?? [];
};
