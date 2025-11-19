import { PauseIcon, PlayIcon, ServerIcon } from "lucide-react";
import Link from "next/link";
import ExecutionStatusBadge from "@/components/common/execution-status-badge";
import { getWorkflows } from "@/queries/workflow";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/ui";

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const workflows = await getWorkflows(workspaceSlug);

  const sortedWorkflows = [...workflows].sort((a, b) => {
    const latestA = a.last_execution?.[0]?.started_at;
    const latestB = b.last_execution?.[0]?.started_at;

    if (!latestA) {
      return latestB ? 1 : 0;
    }

    if (!latestB) {
      return -1;
    }

    return new Date(latestB).getTime() - new Date(latestA).getTime();
  });

  return (
    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_12.5rem_12.5rem_10rem] gap-4 border-b bg-accent p-3 text-muted-foreground text-sm backdrop-blur-sm">
        <p>Workflow</p>
        <p>Instance</p>
        <p>Last Status</p>
        <p>Last Run</p>
      </div>
      {sortedWorkflows.map((workflow) => (
        <Link
          className="grid grid-cols-[1fr_12.5rem_12.5rem_10rem] items-center gap-4 border-b p-3 last:border-b-0 hover:bg-accent"
          href={`/${workspaceSlug}/workflows/${workflow.id}`}
          key={workflow.id}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                workflow.is_active ? "bg-green-100" : "bg-muted"
              )}
            >
              {workflow.is_active ? (
                <PlayIcon className="size-4 text-green-600" />
              ) : (
                <PauseIcon className="size-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm">{workflow.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <ServerIcon className="size-4 text-muted-foreground" />
            <p className="text-sm">{workflow.instance.name}</p>
          </div>
          {workflow.last_execution.length > 0 ? (
            <>
              <ExecutionStatusBadge
                status={workflow.last_execution[0].status}
              />
              <p className="text-muted-foreground text-sm">
                {formatRelativeTime(workflow.last_execution[0].started_at)}
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">-</p>
              <p className="text-muted-foreground text-sm">Never</p>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
