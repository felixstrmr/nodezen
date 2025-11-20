import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkflowStatusBadge from "@/components/common/workflow-status-badge";
import ExecutionActivityChart from "@/components/features/workflow/execution-activity-chart";
import ExecutionDurationChart from "@/components/features/workflow/execution-duration-chart";
import WorkflowPageHeader from "@/components/features/workflow/workflow-page-header";
import { buttonVariants } from "@/components/ui/button";
import { getExecutionsByWorkflowId } from "@/queries/execution";
import { getExecutionMetricsHourly } from "@/queries/execution-metrics";
import { getWorkflow } from "@/queries/workflow";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  const { workspaceId, workflowId } = await params;
  const [workflow, executions, executionMetrics] = await Promise.all([
    getWorkflow(workspaceId, workflowId),
    getExecutionsByWorkflowId(workspaceId, workflowId),
    getExecutionMetricsHourly(workspaceId, workflowId),
  ]);

  if (!workflow) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-8 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">
            {workflow.name}
          </h1>
          <WorkflowStatusBadge
            status={workflow.is_active ? "active" : "inactive"}
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">
            Instance:{" "}
            <span className="text-foreground">{workflow.instance.name}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            ID:{" "}
            <span className="text-foreground">{workflow.n8n_workflow_id}</span>
          </p>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`${workflow.instance.url}/workflow/${workflow.n8n_workflow_id}`}
            target="_blank"
          >
            Open in n8n
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <WorkflowPageHeader executions={executions} />
        <div className="grid grid-cols-2 gap-3">
          <ExecutionActivityChart executionMetrics={executionMetrics} />
          <ExecutionDurationChart executionMetrics={executionMetrics} />
        </div>
      </div>
    </div>
  );
}
