"use client";

import ExecutionStatusIcon from "@/components/icons/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types";
import { formatRelativeTime } from "@/utils/date";

export default function WorkflowCards({
  workflows,
}: {
  workflows: Workflow[];
}) {
  return (
    <div className="flex size-full flex-col gap-1.5 overflow-y-auto">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/50 bg-muted/35 p-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted">
        <ExecutionStatusIcon
          className="size-6"
          status={workflow.last_execution_status}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <h3 className="mb-0.5 font-bold tracking-tight">{workflow.name}</h3>
          <Badge className="capitalize" variant="secondary">
            {workflow.instance_id.name}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Created {formatRelativeTime(workflow.n8n_created_at ?? "")}
        </p>
      </div>
      <div className="mr-3 flex items-center">
        <Badge className="capitalize" variant="outline">
          {workflow.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
    </div>
  );
}
