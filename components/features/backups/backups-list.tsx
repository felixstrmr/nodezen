"use client";

import { createBrowserClient } from "@supabase/ssr";
import { format } from "date-fns";
import { ChevronRightIcon, CornerDownRightIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Backup } from "@/types";
import type { Database } from "@/types/supabase";
import { formatBytes } from "@/utils/file";
import { cn } from "@/utils/ui";

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
);

export default function BackupsList({ backups }: { backups: Backup[] }) {
  const [openedWorkflows, setOpenedWorkflows] = React.useState<string[]>([]);

  const workflowsWithBackups = backups.reduce(
    (acc, backup) => {
      const workflowId = backup.workflow.id;
      const workflowName = backup.workflow.name;
      const instanceId = backup.workflow.instance.id;
      const instanceName = backup.workflow.instance.name;

      if (!acc[workflowId]) {
        acc[workflowId] = {
          name: workflowName,
          instanceId,
          instanceName,
          backups: [],
        };
      }
      acc[workflowId].backups.push(backup);
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        instanceId: string;
        instanceName: string;
        backups: Backup[];
      }
    >
  );

  for (const workflow of Object.values(workflowsWithBackups)) {
    workflow.backups.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  function isLatestBackup(backupId: string) {
    const backup = backups.find((b) => b.id === backupId);

    if (!backup) {
      return false;
    }

    const workflowBackups = backups.filter(
      (b) => b.workflow.id === backup.workflow.id
    );
    if (workflowBackups.length === 0) {
      return false;
    }

    const newestBackup = workflowBackups.reduce((latest, current) =>
      new Date(current.created_at) > new Date(latest.created_at)
        ? current
        : latest
    );

    return newestBackup.id === backupId;
  }

  async function downloadBackup(path: string, filename: string) {
    toast.loading("Downloading backup...", {
      id: "backups-list",
    });

    try {
      const { data, error } = await supabase.storage
        .from("backups")
        .download(path);

      if (error) {
        toast.error("Failed to download backup", {
          id: "backups-list",
        });
        return;
      }

      if (!data) {
        toast.error("No backup data found", {
          id: "backups-list",
        });
        return;
      }

      const blob = new Blob([await data.arrayBuffer()], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup downloaded successfully", {
        id: "backups-list",
      });
    } catch {
      toast.error("Failed to download backup", {
        id: "backups-list",
      });
    }
  }

  return (
    <div className="overflow-y-auto">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_12.5rem_12.5rem_12.5rem] border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p>Backup</p>
        <p>Instance</p>
        <p>Size</p>
        <p>Created</p>
      </div>
      {Object.entries(workflowsWithBackups).map(
        ([
          workflowId,
          { name: workflowName, instanceName, backups: workflowBackups },
        ]) => (
          <div
            className="flex flex-col border-b last:border-b-0"
            key={workflowId}
          >
            <div
              className={cn(
                "grid grid-cols-[1fr_12.5rem_12.5rem_12.5rem] items-center p-2",
                openedWorkflows.includes(workflowId) && "pb-1"
              )}
            >
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setOpenedWorkflows((prev) =>
                      prev.includes(workflowId)
                        ? prev.filter((id) => id !== workflowId)
                        : [...prev, workflowId]
                    )
                  }
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ChevronRightIcon
                    className={
                      openedWorkflows.includes(workflowId) ? "rotate-90" : ""
                    }
                  />
                </Button>
                <h2 className="text-sm">{workflowName}</h2>
              </div>
              <p className="text-sm">{instanceName}</p>
              <p className="font-mono text-sm">
                {formatBytes(
                  workflowBackups.reduce((acc, backup) => acc + backup.size, 0)
                )}
              </p>
              <p className="text-muted-foreground text-sm">-</p>
            </div>
            {openedWorkflows.includes(workflowId) &&
              workflowBackups.map((backup) => (
                <div
                  className="grid grid-cols-[1fr_12.5rem_12.5rem_12.5rem] items-center px-2 py-1 last:pb-2"
                  key={backup.id}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center">
                      <CornerDownRightIcon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="cursor-pointer text-sm hover:underline"
                        onClick={() =>
                          downloadBackup(backup.path, `${backup.id}.json`)
                        }
                        type="button"
                      >
                        {backup.id}.json
                      </button>
                      {isLatestBackup(backup.id) && (
                        <Badge className="rounded-sm bg-blue-100 px-1 text-blue-600">
                          Latest
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{instanceName}</p>
                  <p className="font-mono text-sm">
                    {formatBytes(backup.size)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {format(backup.created_at, "PPp")}
                  </p>
                </div>
              ))}
          </div>
        )
      )}
    </div>
  );
}
