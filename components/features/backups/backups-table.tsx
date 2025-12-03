"use client";

import type { Backup } from "@/types";

export default function BackupsTable({ backups }: { backups: Backup[] }) {
  return (
    <div className="overflow-y-auto">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_12.5rem_12.5rem_12.5rem] border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p>Backup</p>
        <p>Instance</p>
        <p>Size</p>
        <p>Created</p>
      </div>
      <div className="flex flex-col overflow-y-auto">
        {backups.map((backup) => (
          <div key={backup.id}>
            <p>{backup.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
