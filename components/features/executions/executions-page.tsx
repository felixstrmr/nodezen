import { format } from "date-fns";
import ExecutionsPageHeader from "@/components/features/executions/executions-page-header";
import ExecutionStatusIcon from "@/components/icons/dynamic/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import { getExecutions } from "@/queries/execution";
import { formatRelativeTime } from "@/utils/date";
import { formatDuration } from "@/utils/time";
import { cn } from "@/utils/ui";

export default async function ExecutionsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const executions = await getExecutions(workspaceId);

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <ExecutionsPageHeader executions={executions} />
      <div className="overflow-y-auto rounded-lg border">
        <div className="sticky top-0 z-10 grid grid-cols-[1fr_20rem_10rem_10rem_10rem] gap-4 border-b bg-accent p-3 text-muted-foreground text-sm backdrop-blur-sm">
          <p>Workflow</p>
          <p>Instance</p>
          <p>Duration</p>
          <p>Mode</p>
          <p>Started</p>
        </div>
        {executions.map((execution) => (
          <div
            className="grid grid-cols-[1fr_20rem_10rem_10rem_10rem] items-center gap-4 border-b p-3 last:border-b-0 hover:bg-accent"
            key={execution.id}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-md bg-muted",
                  execution.status === "error" && "0 bg-red-100",
                  execution.status === "success" && "bg-green-100",
                  execution.status === "waiting" && "bg-yellow-100",
                  execution.status === "running" && "bg-yellow-100"
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
    </div>
  );
}
