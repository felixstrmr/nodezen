import { cacheLife, cacheTag } from "next/cache";
import { supabaseClient } from "@/lib/clients/supabase-client";

export async function getUser() {
  "use cache: private";

  const supabase = await supabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { user: null, error: userError };
  }

  if (!user) {
    return { user: null, error: new Error("User not found") };
  }

  cacheLife("max");
  cacheTag(`user:${user.id}`);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { user: null, error };
  }

  return { user: data, error: null };
}
