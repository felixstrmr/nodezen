import type { Execution } from "@/types";

export default function ExecutionsHeader({
  executions,
}: {
  executions: Execution[];
}) {
  const totalExecutions = executions.length;
  const successExecutions = executions.filter(
    (execution) => execution.status === "success"
  ).length;
  const errorExecutions = executions.filter(
    (execution) => execution.status === "error"
  ).length;
  const successRate = Math.round((successExecutions / totalExecutions) * 100);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="flex h-8 items-center font-semibold text-xl tracking-tight">
        Executions
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="font-bold text-2xl text-foreground">
            {totalExecutions}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Success</p>
          <p className="font-bold text-2xl text-foreground">
            {successExecutions}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Error</p>
          <p className="font-bold text-2xl text-foreground">
            {errorExecutions}
          </p>
        </div>
        <div className="w-full rounded-lg border border-border/50 bg-muted/35 p-3">
          <p className="text-muted-foreground text-sm">Sucess Rate</p>
          <p className="font-bold text-2xl text-foreground">{successRate}%</p>
        </div>
      </div>
    </div>
  );
}
