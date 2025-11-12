import ExecutionStatusIcon from "@/components/icons/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import { getWorkflows } from "@/queries/workflow";
import type { Workflow } from "@/types";
import { formatRelativeTime } from "@/utils/date";

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();

  const sortedWorkflows = workflows.sort((a, b) =>
    (b.last_execution_status ?? "").localeCompare(a.last_execution_status ?? "")
  );

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
          <Badge className="capitalize" variant="outline">
            {workflow.instance_id.name}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Created {formatRelativeTime(workflow.n8n_created_at ?? "")}
        </p>
      </div>
    </div>
  );
}
