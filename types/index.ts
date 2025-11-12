import type { Tables } from "@/types/supabase";

export type Instance = Tables<"instances">;
export type Workflow = Tables<"workflows"> & {
  instance_id: Pick<Instance, "name">;
};
