import { format } from "date-fns";
import ExecutionStatusIcon from "@/components/icons/execution-status-icon";
import { Badge } from "@/components/ui/badge";
import type { Execution } from "@/types";
import { formatDateDifference } from "@/utils/date";

export default function ExecutionCards({
  executions,
}: {
  executions: Execution[];
}) {
  return (
    <div className="flex size-full flex-col gap-1.5 overflow-y-auto">
      {executions.map((execution) => (
        <ExecutionCard execution={execution} key={execution.id} />
      ))}
    </div>
  );
}

function ExecutionCard({ execution }: { execution: Execution }) {
  return (
    <div className="grid grid-cols-3 items-center gap-3 rounded-lg border border-border/50 bg-muted/35 p-3">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted">
          <ExecutionStatusIcon className="size-6" status={execution.status} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold tracking-tight">
              {format(execution.n8n_started_at, "PPp")}
            </h3>
            <p className="text-muted-foreground text-sm">
              #{execution.n8n_execution_id}
            </p>
          </div>
          <Badge variant="secondary">{execution.workflow.name}</Badge>
        </div>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Duration</p>
        <p className="font-semibold text-foreground">
          {
            formatDateDifference(
              new Date(execution.n8n_started_at),
              new Date(execution.n8n_stopped_at ?? new Date())
            ).formatted
          }
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Mode</p>
        <p className="font-semibold text-foreground capitalize">
          {execution.mode}
        </p>
      </div>
    </div>
  );
}
