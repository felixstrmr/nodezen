"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { Workflow } from "@/types";
import { cn } from "@/utils/ui";

export const WorkflowsTableColumns: ColumnDef<Workflow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const workflow = row.original;

      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              workflow.is_active ? "bg-green-950" : "bg-muted"
            )}
          >
            {workflow.is_active ? (
              <PlayIcon className="size-4 text-green-500" />
            ) : (
              <PauseIcon className="size-4 text-muted-foreground" />
            )}
          </div>
          <p>{workflow.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "instance.name",
    header: "Instance",
  },
  {
    accessorKey: "is_active",
    header: "Active",
  },
];
