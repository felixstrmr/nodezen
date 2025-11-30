import { format } from "date-fns";
import type { Workflow, WorkflowMetrics } from "@/types";

export default function WorkflowsTable({
  workflows,
  metrics,
}: {
  workflows: Workflow[];
  metrics: WorkflowMetrics[];
}) {
  const workflowsWithMetrics = workflows.map((workflow) => {
    const metric = metrics.find((m) => m.workflow === workflow.id);
    return {
      ...workflow,
      metrics: metric || null,
    };
  });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p>Name</p>
        <p>Instance</p>
        <p>Last execution at</p>
      </div>
      <div className="flex flex-col">
        {workflowsWithMetrics.map((workflow) => (
          <div
            className="grid grid-cols-4 border-b p-3 text-sm"
            key={workflow.id}
          >
            <div>
              <p>{workflow.name}</p>
            </div>
            <p>{workflow.instance.name}</p>
            <p>
              {workflow.metrics?.last_execution_at
                ? format(workflow.metrics.last_execution_at, "PPp")
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
