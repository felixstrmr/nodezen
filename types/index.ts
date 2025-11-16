import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";

export type Supabase = SupabaseClient<Database>;

export type Instance = Tables<"instances"> & {
  workspace: {
    slug: string;
  };
};

export type Workflow = Tables<"workflows"> & {
  instance: {
    name: string;
  };
  workspace: {
    slug: string;
  };
};

export type Backup = Tables<"backups"> & {
  workflow: {
    id: string;
    name: string;
  };
  workspace: {
    slug: string;
  };
};
