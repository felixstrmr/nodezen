import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getAlertChannels(workspaceId: string) {
  "use cache: private";
  cacheLife("max");
  cacheTag(`alert-channels:${workspaceId}`);

  const supabase = await supabaseClient();

  const { data } = await supabase
    .from("alert_channels")
    .select("*")
    .eq("workspace", workspaceId)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
}

