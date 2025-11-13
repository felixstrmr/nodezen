import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/clients/supabase-client";
import { getUser } from "@/queries/user";

export async function getInstances() {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`instances:${user.id}`);

  const { data } = await supabase
    .from("instances")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
}

export async function getInstance(instanceId: string) {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  cacheTag(`instance:${instanceId}`);

  const { data } = await supabase
    .from("instances")
    .select("*")
    .eq("id", instanceId)
    .eq("user_id", user.id)
    .maybeSingle()
    .throwOnError();

  return data;
}
