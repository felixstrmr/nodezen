import { formatDistance } from "date-fns";
import type { Backup } from "@/types";
import { formatBytes } from "@/utils/file";

export default function BackupsPageHeader({ backups }: { backups: Backup[] }) {
  const workflows = backups.map((backup) => backup.workflow);

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="w-full rounded-lg border border-border/50 bg-accent/30 p-3">
        <p className="text-muted-foreground text-sm">Total Backups</p>
        <p className="font-semibold text-lg tracking-tight">{backups.length}</p>
      </div>
      <div className="w-full rounded-lg border border-border/50 bg-accent/30 p-3">
        <p className="text-muted-foreground text-sm">Workflows</p>
        <p className="font-semibold text-lg tracking-tight">
          {workflows.length}
        </p>
      </div>
      <div className="w-full rounded-lg border border-border/50 bg-accent/30 p-3">
        <p className="text-muted-foreground text-sm">Total Size</p>
        <p className="font-semibold text-lg tracking-tight">
          {formatBytes(
            backups.reduce((acc, backup) => acc + backup.size_bytes, 0)
          )}
        </p>
      </div>
      <div className="w-full rounded-lg border border-border/50 bg-accent/30 p-3">
        <p className="text-muted-foreground text-sm">Next Backup</p>
        <p className="font-semibold text-lg tracking-tight">
          {(() => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setHours(24, 0, 0, 0);
            return formatDistance(nextMidnight, now, {
              addSuffix: true,
            });
          })()}
        </p>
      </div>
    </div>
  );
}
