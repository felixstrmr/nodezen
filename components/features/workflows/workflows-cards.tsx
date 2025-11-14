"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types";
import { formatRelativeTime } from "@/utils/date";

export default function WorkflowCards({
  workflows,
}: {
  workflows: Workflow[];
}) {
  return (
    <div className="flex size-full flex-col gap-1.5 overflow-y-auto rounded-2xl border p-3">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Link
      className="flex gap-3 rounded-lg border border-border/50 bg-neutral-900 p-3"
      href={`/dashboard/workflows/${workflow.id}`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted">
        {workflow.is_active ? <PlayIcon /> : <PauseIcon />}
      </div>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <h3 className="mb-0.5 font-bold tracking-tight">{workflow.name}</h3>
          <Badge variant="secondary">{workflow.instance.name}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Last run:{" "}
          {workflow.last_execution_at
            ? formatRelativeTime(workflow.last_execution_at)
            : "Never"}
        </p>
      </div>
      <div className="mr-3 flex items-center">
        <Badge className="capitalize" variant="outline">
          {workflow.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
    </Link>
  );
}
