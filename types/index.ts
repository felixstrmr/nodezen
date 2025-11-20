import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";

export type Supabase = SupabaseClient<Database>;

export type Workspace = Tables<"workspaces">;
export type ExecutionMetricsHourly = Tables<"execution_metrics_hourly">;
export type Instance = Tables<"instances">

export type Workflow = Tables<"workflows"> & {
  instance: {
    name: string;
  };
};

export type Execution = Tables<"executions"> & {
  workflow: {
    name: string;
  };
};

export type Backup = Tables<"backups"> & {
  workflow: {
    id: string;
    name: string;
    instance: {
      id: string;
      name: string;
    };
  };
};
