import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { getUser } from "@/queries/user";

export async function getWorkflows(instanceId: string) {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`workflows:${instanceId}`);

  const { data } = await supabase
    .from("workflows")
    .select("*, instance_id:instances(id, name)")
    .order("created_at", { ascending: false })
    .eq("instance_id", instanceId)
    .throwOnError();

  return data;
}
