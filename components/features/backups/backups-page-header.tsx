import { formatDistance } from "date-fns";
import React from "react";
import type { Backup, Workspace } from "@/types";
import { formatBytes } from "@/utils/file";

export default function BackupsPageHeader({
  backups,
  workspace,
}: {
  backups: Backup[];
  workspace: Workspace;
}) {
  const workflows = new Set(backups.map((backup) => backup.workflow.id)).size;

  const nextBackup = React.useMemo(() => {
    switch (workspace.subscription) {
      case "pro":
        return new Date(Date.now() + 1000 * 60 * 60 * 24);
      case "premium":
        return new Date(Date.now() + 1000 * 60 * 60);
      default:
        return new Date(Date.now() + 1000 * 60 * 60 * 24);
    }
  }, [workspace.subscription]);

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Total Backups</p>
        <p className="font-semibold text-lg tracking-tight">{backups.length}</p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Workflows</p>
        <p className="font-semibold text-lg tracking-tight">{workflows}</p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Total Size</p>
        <p className="font-semibold text-lg tracking-tight">
          {formatBytes(
            backups.reduce((acc, backup) => acc + backup.size_bytes, 0)
          )}
        </p>
      </div>
      <div className="w-full rounded-lg border bg-accent p-3">
        <p className="text-muted-foreground text-sm">Next Backup</p>
        <p className="font-semibold text-lg tracking-tight">
          {formatDistance(nextBackup, new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
