"use client";

import { parseAsString, useQueryStates } from "nuqs";
import ExecutionStatusIcon from "@/components/icons/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types";
import { formatRelativeTime } from "@/utils/date";

export default function WorkflowCards({
  workflows,
}: {
  workflows: Workflow[];
}) {
  const [filters] = useQueryStates({
    instanceId: parseAsString.withDefault(""),
    sort: parseAsString,
  });

  const filteredWorkflows = workflows.filter((workflow) => {
    if (!filters.instanceId) {
      return true;
    }

    return workflow.instance_id.id === filters.instanceId;
  });

  const sortedWorkflows = filteredWorkflows.sort((a, b) => {
    if (filters.sort === "status") {
      return (b.last_execution_status ?? "").localeCompare(
        a.last_execution_status ?? ""
      );
    }

    if (filters.sort === "created") {
      return (b.n8n_created_at ?? "").localeCompare(a.n8n_created_at ?? "");
    }

    return 0;
  });

  return (
    <div className="flex size-full flex-col gap-1.5 overflow-y-auto">
      {sortedWorkflows.map((workflow) => (
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
