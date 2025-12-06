import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { TotalWorkflowMetric, Workflow } from "@/types";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/ui";

export default function WorkflowsTable({
  workspaceId,
  workflows,
  metrics,
}: {
  workspaceId: string;
  workflows: Workflow[];
  metrics: TotalWorkflowMetric[];
}) {
  const workflowsWithMetrics = workflows.map((workflow) => {
    const metric = metrics?.find((m) => m.workflow === workflow.id);
    return {
      ...workflow,
      metric,
    };
  });

  const sortedWorkflows = workflowsWithMetrics.sort((a, b) => {
    if (a.is_active && !b.is_active) {
      return -1;
    }
    if (!a.is_active && b.is_active) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-6 items-center border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p className="col-span-2">Name</p>
        <p className="col-span-1">Instance</p>
        <p className="col-span-1">Status</p>
        <p className="col-span-1">Last execution</p>
        <p className="col-span-1">Success rate</p>
      </div>
      <div className="flex flex-col">
        {sortedWorkflows.map(({ metric, ...workflow }) => (
          <Link
            className="grid cursor-pointer grid-cols-6 items-center border-b p-2 text-sm last:border-b-0 hover:bg-muted/50"
            href={`/${workspaceId}/workflows/${workflow.id}`}
            key={workflow.id}
          >
            <div className="col-span-2 flex items-center gap-2">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-md",
                  workflow.is_active ? "bg-green-500/10" : "bg-muted"
                )}
              >
                {workflow.is_active ? (
                  <PlayIcon className="size-3.5 text-green-600" />
                ) : (
                  <PauseIcon className="size-3.5 text-muted-foreground" />
                )}
              </div>
              <p>{workflow.name}</p>
            </div>
            <p className="col-span-1">{workflow.instance.name}</p>
            <Badge
              className="gap-1.5 rounded-sm bg-background px-1.5 capitalize"
              variant="outline"
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  workflow.is_active ? "bg-green-500" : "bg-red-500"
                )}
              />
              {workflow.is_active ? "Active" : "Inactive"}
            </Badge>
            <div className="flex items-center gap-2">
              {metric?.last_execution_at ? (
                <>
                  {metric.last_execution_status === "success" ? (
                    <CheckIcon className="size-3.5 text-green-600" />
                  ) : (
                    <XIcon className="size-3.5 text-red-600" />
                  )}
                  <p>{formatRelativeTime(metric.last_execution_at)}</p>
                </>
              ) : (
                <p className="text-muted-foreground">N/A</p>
              )}
            </div>
            <p>{metric?.success_rate || 0}%</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
