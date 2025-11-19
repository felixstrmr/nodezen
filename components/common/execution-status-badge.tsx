import { Badge } from "@/components/ui/badge";
import type { ExecutionStatus } from "@/types/n8n";
import { cn } from "@/utils/ui";

export default function ExecutionStatusBadge({
  status,
}: {
  status: ExecutionStatus;
}) {
  const statusBadgeVariants = {
    error: "bg-red-100 border text-red-600",
    success: "bg-green-100 border text-green-600",
    waiting: "bg-yellow-100 border text-yellow-600",
    running: "bg-yellow-100 border text-yellow-600",
    canceled: "bg-red-100 border text-red-600",
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
