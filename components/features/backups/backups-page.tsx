import { FileIcon, GitBranchIcon, ServerIcon } from "lucide-react";
import Link from "next/link";
import BackupsPageHeader from "@/components/features/backups/backups-page-header";
import { Badge } from "@/components/ui/badge";
import { getBackups } from "@/queries/backup";
import { getInstances } from "@/queries/instance";
import { getWorkflows } from "@/queries/workflow";
import { formatRelativeTime } from "@/utils/date";
import { formatBytes } from "@/utils/file";

export default async function BackupsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; backups: string[] }>;
}) {
  const { workspaceSlug, backups } = await params;
  const paths = backups.slice(1);

  const [instances, workflows, data] = await Promise.all([
    getInstances(workspaceSlug),
    getWorkflows(workspaceSlug),
    getBackups(workspaceSlug),
  ]);

  function getWorkflowsByInstance(instanceId: string) {
    return workflows.filter((workflow) => workflow.instance.id === instanceId);
  }

  function getBackupsByWorkflow(workflowId: string) {
    return data
      .filter((backup) => backup.workflow.id === workflowId)
      .map((backup) => ({
        id: backup.id,
        name: backup.workflow.name,
        created_at: backup.created_at,
        size: backup.size,
      }));
  }

  function isLatestBackup(backupId: string) {
    const backup = data.find((b) => b.id === backupId);

    if (!backup) {
      return false;
    }

    const workflowBackups = getBackupsByWorkflow(backup.workflow.id);
    if (workflowBackups.length === 0) {
      return false;
    }

    const newestBackup = workflowBackups[0];
    return newestBackup.id === backupId;
  }

  return (
    <div className="flex size-full flex-col gap-3">
      <BackupsPageHeader
        backups={data}
        instances={instances}
        workflows={workflows}
      />
      <div className="size-full rounded-lg border">
        <div className="grid grid-cols-[1fr_15rem_15rem] rounded-t-lg border-b bg-accent/30 p-3">
          <p>Name</p>
          <p>Size</p>
          <p>Created</p>
        </div>
        {paths.length === 0 && (
          <div className="flex flex-col">
            {instances.map((instance) => (
              <Link
                className="grid grid-cols-[1fr_15rem_15rem] items-center border-b p-3 last:border-b-0 hover:bg-accent/30"
                href={`/${workspaceSlug}/backups/${instance.id}`}
                key={instance.id}
              >
                <div className="flex items-center gap-2">
                  <ServerIcon className="size-4 text-muted-foreground" />
                  {instance.name}
                </div>
                <p className="font-mono text-sm">-</p>
                <p className="text-muted-foreground text-sm">
                  {formatRelativeTime(instance.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
        {paths.length === 1 && (
          <div className="flex flex-col">
            {getWorkflowsByInstance(paths[0]).map((workflow) => (
              <Link
                className="grid grid-cols-[1fr_15rem_15rem] items-center border-b p-3 last:border-b-0 hover:bg-accent/30"
                href={`/${workspaceSlug}/backups/${paths[0]}/${workflow.id}`}
                key={workflow.id}
              >
                <div className="flex items-center gap-2">
                  <GitBranchIcon className="size-4 text-muted-foreground" />
                  {workflow.name}
                </div>
                <p className="font-mono text-sm">-</p>
                <p className="text-muted-foreground text-sm">
                  {formatRelativeTime(workflow.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
        {paths.length === 2 && (
          <div className="flex flex-col">
            {getBackupsByWorkflow(paths[1]).map((backup) => (
              <div
                className="grid grid-cols-[1fr_15rem_15rem] items-center border-b p-3 last:border-b-0 hover:bg-accent/30"
                key={backup.id}
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="size-4 text-muted-foreground" />
                  <span>{backup.name.replace(/[^a-z0-9_-]/gi, "_")}.json</span>
                  {isLatestBackup(backup.id) && (
                    <Badge className="rounded-sm border-blue-900 bg-blue-950 px-1 text-blue-500">
                      Latest
                    </Badge>
                  )}
                </div>
                <p className="font-mono text-sm">{formatBytes(backup.size)}</p>
                <p className="text-muted-foreground text-sm">
                  {formatRelativeTime(backup.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
