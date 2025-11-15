import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutions(workspaceSlug: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${workspaceSlug}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("executions")
    .select("*, workspace!inner(slug), workflow(name)")
    .eq("workspace.slug", workspaceSlug)
    .order("started_at", { ascending: false })
    .throwOnError();

  return data;
}
