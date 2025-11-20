import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getInstances(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`instances:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("instances")
    .select("*")
    .eq("workspace", workspaceId)
    .order("created_at", { ascending: true })
    .throwOnError();

  return data;
}
