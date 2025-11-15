import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types";
import { cn } from "@/utils/ui";

export default function WorkflowStatusBadge({
  workflow,
}: {
  workflow: Workflow;
}) {
  const statusBadgeVariants = {
    error: "bg-red-950 border border-red-900 text-red-500",
    success: "bg-green-950 border border-green-900 text-green-500",
    waiting: "bg-yellow-950 border border-yellow-900 text-yellow-500",
    running: "bg-yellow-950 border border-yellow-900 text-yellow-500",
    canceled: "bg-gray-950 border border-gray-900 text-gray-500",
  };

  return (
    <Badge
      className={cn(
        "rounded-sm px-1 capitalize",
        statusBadgeVariants[
          workflow.last_execution_status as keyof typeof statusBadgeVariants
        ]
      )}
    >
      {workflow.last_execution_status}
    </Badge>
  );
}
