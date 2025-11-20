import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkspaceUser(workspaceId: string) {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  cacheTag(`workspace-user:${workspaceId}:${user.id}`);

  const { data } = await supabase
    .from("workspace_users")
    .select("*, workspace!inner(id, subscription), user!inner(*)")
    .eq("workspace.id", workspaceId)
    .eq("user.id", user.id)
    .maybeSingle()
    .throwOnError();

  return data;
}
