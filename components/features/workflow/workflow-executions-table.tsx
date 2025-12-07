import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Execution } from "@/types";
import { formatDuration } from "@/utils/time";
import { cn } from "@/utils/ui";

export default function WorkflowExecutionsTable({
  executions,
}: {
  executions: Execution[];
}) {
  return (
    <div className="flex flex-col rounded-lg bg-muted p-0.5">
      <div className="px-2 pt-2">
        <h2 className="font-semibold tracking-tight">Executions</h2>
      </div>
      <div className="grid grid-cols-4 p-2 text-muted-foreground text-sm">
        <p>Started at</p>
        <p>Status</p>
        <p>Mode</p>
        <p>Duration</p>
      </div>
      <div className="flex flex-col rounded-md border bg-background shadow-xs">
        {executions.map((execution) => (
          <div
            className="grid grid-cols-4 items-center border-b p-2 text-sm last:border-b-0"
            key={execution.id}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-md",
                  execution.status === "success"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                )}
              >
                {execution.status === "success" ? (
                  <CheckIcon className="size-3.5 text-green-600" />
                ) : (
                  <XIcon className="size-3.5 text-red-600" />
                )}
              </div>
              <p>{format(execution.started_at, "PPp")}</p>
            </div>
            <Badge
              className="gap-1.5 rounded-sm bg-background px-1.5 capitalize"
              variant="outline"
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  execution.status === "success" ? "bg-green-500" : "bg-red-500"
                )}
              />
              {execution.status}
            </Badge>
            <p className="text-muted-foreground capitalize">{execution.mode}</p>
            <p className="font-mono text-muted-foreground">
              {execution.duration_ms
                ? formatDuration(execution.duration_ms)
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
