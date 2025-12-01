import { logger } from "@trigger.dev/sdk";
import type { Supabase } from "@/types";
import { createInstanceContext } from "./create-instance-context";

type Backup = {
  id: string;
  n8n_version_id: string;
  workspace: string;
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
  const existingBackups = await getExistingBackups(supabase, instanceId);
}

async function getExistingBackups(supabase: Supabase, instanceId: string) {
  const { data } = await supabase
    .from("backups")
    .select("id, n8n_version_id, workflow(instance), workspace")
    .eq("workflow.instance", instanceId)
    .throwOnError();

  logger.info(`${data.length} existing backups fetched`, {
    instanceId,
  });

  return data;
}
