import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getExecutionsByWorkflowId(instanceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`executions:${instanceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("executions")
    .select("*, workflow:workflows!inner(id, name)")
    .order("n8n_started_at", { ascending: false })
    .eq("workflow.instance_id", instanceId)
    .throwOnError();

  return data;
}
