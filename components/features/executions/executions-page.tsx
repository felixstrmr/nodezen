import { format } from "date-fns";
import ExecutionStatusIcon from "@/components/icons/dynamic/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import { getExecutions } from "@/queries/execution";
import { formatRelativeTime } from "@/utils/date";
import { formatTimeDifference } from "@/utils/time";
import { cn } from "@/utils/ui";

export default async function ExecutionsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const executions = await getExecutions(workspaceSlug);

  return (
    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_20rem_10rem_10rem_10rem] gap-4 border-b bg-accent/30 p-3 backdrop-blur-sm">
        <p>Workflow</p>
        <p>Workflow</p>
        <p>Duration</p>
        <p>Mode</p>
        <p>Started</p>
      </div>
      {executions.map((execution) => (
        <div
          className="grid grid-cols-[1fr_20rem_10rem_10rem_10rem] items-center gap-4 border-b p-3 last:border-b-0 hover:bg-accent/30"
          key={execution.id}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md bg-muted",
                execution.status === "error" && "bg-red-950",
                execution.status === "success" && "bg-green-950",
                execution.status === "waiting" && "bg-yellow-950",
                execution.status === "running" && "bg-yellow-950"
              )}
            >
              <ExecutionStatusIcon status={execution.status} />
            </div>
            <p>{format(execution.started_at, "PPp")}</p>
          </div>
          <Badge className="rounded-sm px-1 capitalize" variant="secondary">
            {execution.workflow.name}
          </Badge>
          <p className="font-mono">
            {execution.stopped_at
              ? formatTimeDifference(
                  new Date(execution.started_at),
                  new Date(execution.stopped_at)
                )
              : "-"}
          </p>
          <p className="capitalize">{execution.mode}</p>
          <p>{formatRelativeTime(execution.started_at)}</p>
        </div>
      ))}
    </div>
  );
}
