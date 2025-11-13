import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Execution } from "@/types";

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
    <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/35 p-3">
      <h3 className="font-bold tracking-tight">
        {format(execution.n8n_started_at, "PPp")}
      </h3>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{execution.workflow.name}</Badge>
        <p className="text-muted-foreground text-sm capitalize">
          {execution.status}
        </p>
      </div>
    </div>
  );
}
