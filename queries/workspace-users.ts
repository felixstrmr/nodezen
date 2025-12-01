import { cacheLife } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getWorkspaceUser(workspaceId: string) {
  "use cache: private";
  cacheLife("max");

  const supabase = await supabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { workspaceUser: null, error };
  }

  if (!user) {
    return { workspaceUser: null, error: new Error("User not found") };
  }

  const { data, error: workspaceUsersError } = await supabase
    .from("workspace_users")
    .select("*, user!inner(id, email, avatar)")
    .eq("workspace", workspaceId)
    .eq("user.id", user.id)
    .maybeSingle();

  if (workspaceUsersError) {
    return { workspaceUser: null, error: workspaceUsersError };
  }

  return { workspaceUser: data, error: null };
}
