import type { Supabase } from "@/types";
import { createInstanceContext } from "./create-instance-context";

type Backup = {
  id: string;
  n8n_version_id: string;
  workflow: {
    instance: string;
  };
};

export async function syncBackups(
  supabase: Supabase,
  instanceId: string,
  workspaceId: string
) {
  const { client } = await createInstanceContext(supabase, instanceId);

  const workflows = await client.getWorkflows();
}
