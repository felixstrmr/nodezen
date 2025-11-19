import { Badge } from "@/components/ui/badge";
import type { WorkflowStatus } from "@/types/n8n";
import { cn } from "@/utils/ui";

export default function WorkflowStatusBadge({
  status,
}: {
  status: WorkflowStatus;
}) {
  const statusBadgeVariants = {
    active: "bg-green-100 border text-green-600",
    inactive: "bg-muted border text-muted-foreground",
  };

  return (
    <Badge
      className={cn("rounded-sm px-1 capitalize", statusBadgeVariants[status])}
      variant="secondary"
    >
      {status}
    </Badge>
  );
}
