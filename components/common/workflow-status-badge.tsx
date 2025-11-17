import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types";
import { cn } from "@/utils/ui";

export default function WorkflowStatusBadge({
  workflow,
}: {
  workflow: Workflow;
}) {
  const statusBadgeVariants = {
    error: "bg-red-100 border border-red-200 text-red-600",
    success: "bg-green-100 border border-green-200 text-green-600",
    waiting: "bg-yellow-100 border border-yellow-200 text-yellow-600",
    running: "bg-yellow-100 border border-yellow-200 text-yellow-600",
    canceled: "bg-gray-100 border border-gray-200 text-gray-600",
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
