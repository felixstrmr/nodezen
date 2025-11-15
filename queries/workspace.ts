import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkspace(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`workspace:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .maybeSingle()
    .throwOnError();

  return data;
}
