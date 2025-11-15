import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";

export type Supabase = SupabaseClient<Database>;

export type Workflow = Tables<"workflows"> & {
  instance: {
    name: string;
  };
};
