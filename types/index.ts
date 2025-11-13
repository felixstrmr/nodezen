import type { Tables } from "@/types/supabase";

export type Instance = Tables<"instances">;

export type Workflow = Tables<"workflows"> & {
  instance: Pick<Instance, "name">;
};
export type Execution = Tables<"executions"> & {
  workflow: Pick<Workflow, "id" | "name">;
};
