import { PauseIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
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

  return (
    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border">
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_10rem_10rem_10rem] gap-4 border-b bg-accent/30 p-3 backdrop-blur-sm">
        <p>Workflow</p>
        <p>Instance</p>
        <p>Active</p>
        <p>Created</p>
      </div>
      {workflows.map((workflow) => (
        <Link
          className="grid grid-cols-[1fr_10rem_10rem_10rem] items-center gap-4 border-b p-3 last:border-b-0 hover:bg-accent/30"
          href={`/${workspaceSlug}/workflows/${workflow.id}`}
          key={workflow.id}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                workflow.is_active ? "bg-green-950" : "bg-muted"
              )}
            >
              {workflow.is_active ? (
                <PlayIcon className="size-4 text-green-500" />
              ) : (
                <PauseIcon className="size-4 text-muted-foreground" />
              )}
            </div>
            <p>{workflow.name}</p>
          </div>
          <p>{workflow.instance.name}</p>
          <p>{workflow.is_active ? "Yes" : "No"}</p>
          <p>{formatRelativeTime(workflow.created_at)}</p>
        </Link>
      ))}
    </div>
  );
}
