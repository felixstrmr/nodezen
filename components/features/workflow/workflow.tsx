import { ArrowUpRightIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { WorkflowIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { getWorkflowTotalMetrics } from "@/queries/metrics";
import { getWorkflow } from "@/queries/workflows";
import { cn } from "@/utils/ui";
import WorkflowMetricsHeader from "./workflow-metrics-header";

export default async function Workflow({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  const { workspaceId, workflowId } = await params;
  const [{ workflow, error }, { metrics, error: totalMetricsError }] =
    await Promise.all([
      getWorkflow(workspaceId, workflowId),
      getWorkflowTotalMetrics(workspaceId, workflowId),
    ]);

  if (error || totalMetricsError) {
    return <p>Error: {error?.message || totalMetricsError?.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-4">
          <div className="flex h-8 items-center gap-2">
            <WorkflowIcon className="size-4 text-muted-foreground opacity-75" />
            <h1 className="font-semibold text-xl tracking-tight">
              {workflow?.name}
            </h1>
          </div>
          <Badge
            className="gap-1.5 rounded-sm bg-background px-1.5 capitalize"
            variant="outline"
          >
            <div
              className={cn(
                "size-2 rounded-full",
                workflow?.is_active ? "bg-green-500" : "bg-red-500"
              )}
            />
            {workflow?.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`${workflow?.instance.n8n_url}/workflow/${workflow?.n8n_workflow_id}`}
            target="_blank"
          >
            Open
            <ArrowUpRightIcon />
          </Link>
          <Button size="icon" variant="outline">
            <MoreVerticalIcon />
          </Button>
        </div>
      </div>
      <div className="flex size-full flex-col p-3">
        <WorkflowMetricsHeader metrics={metrics || null} />
      </div>
    </div>
  );
}
