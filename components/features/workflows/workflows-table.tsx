import { PauseIcon, PlayIcon } from "@/components/icons";
import type { Workflow } from "@/types";
import { cn } from "@/utils/ui";
import Link from "next/link";

export default function WorkflowsTable({
  workspaceId,
  workflows,
}: {
  workspaceId: string;
  workflows: Workflow[];
}) {
  const sortedWorkflows = workflows.sort((a, b) => {
    if (a.is_active && !b.is_active) {
      return -1;
    }
    if (!a.is_active && b.is_active) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 items-center border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p className="col-span-4">Name</p>
        <p className="col-span-2">Instance</p>
      </div>
      <div className="flex flex-col">
        {sortedWorkflows.map((workflow) => (
          <Link
            href={`/${workspaceId}/workflows/${workflow.id}`}
            className="grid grid-cols-12 hover:bg-muted/50 cursor-pointer items-center border-b p-3 text-sm last:border-b-0"
            key={workflow.id}
          >
            <div className="col-span-4 flex items-center gap-2">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-md",
                  workflow.is_active ? "bg-green-500/10" : "bg-muted"
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
            <p className="col-span-2">{workflow.instance.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
