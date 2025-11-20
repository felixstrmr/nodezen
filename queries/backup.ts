import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export const getBackups = async (workspaceId: string) => {
  "use cache: private";
  cacheLife("max");
  cacheTag(`backups:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("backups")
    .select("*, workflow(id, name, instance(id, name))")
    .eq("workspace", workspaceId)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data ?? [];
};
