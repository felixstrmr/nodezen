import { format } from "date-fns";
import ExecutionStatusIcon from "@/components/icons/dynamic/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import { getExecutions } from "@/queries/execution";
import { formatRelativeTime } from "@/utils/date";
import { formatDuration } from "@/utils/time";
import { cn } from "@/utils/ui";

export default async function ExecutionsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const executions = await getExecutions(workspaceSlug);

  return (
    <div className="overflow-y-auto rounded-lg border">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_20rem_10rem_10rem_10rem] gap-4 border-b bg-accent/30 p-3 backdrop-blur-sm">
        <p className="text-sm">Workflow</p>
        <p className="text-sm">Instance</p>
        <p className="text-sm">Duration</p>
        <p className="text-sm">Mode</p>
        <p className="text-sm">Started</p>
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
            <p className="text-sm">{format(execution.started_at, "PPp")}</p>
          </div>
          <Badge className="rounded-sm px-1 capitalize" variant="secondary">
            {execution.workflow.name}
          </Badge>
          <p className="font-mono text-sm">
            {formatDuration(execution.duration_ms)}
          </p>
          <p className="text-sm capitalize">{execution.mode}</p>
          <p className="text-muted-foreground text-sm">
            {formatRelativeTime(execution.started_at)}
          </p>
        </div>
      ))}
    </div>
  );
}
