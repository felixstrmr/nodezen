import { createInstanceContext } from "@/tasks/shared/create-instance-context";
import type { Supabase } from "@/types";

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
