import {
  CircleCheckIcon,
  CircleQuestionMarkIcon,
  CircleXIcon,
  ClockIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import type { ExecutionStatus } from "@/types/n8n";
import { cn } from "@/utils/ui";

export default function ExecutionStatusIcon({
  status,
  className,
}: {
  status: ExecutionStatus | null;
  className?: string;
}) {
  const Icon =
    {
      error: CircleXIcon,
      success: CircleCheckIcon,
      waiting: ClockIcon,
      running: Loader2Icon,
      canceled: XIcon,
    }[status as ExecutionStatus] ?? CircleQuestionMarkIcon;

  const color =
    {
      error: "text-red-500",
      success: "text-green-500",
      waiting: "text-yellow-500",
      running: "text-blue-500",
      canceled: "text-red-500",
    }[status as ExecutionStatus] ?? "text-muted-foreground";

  return <Icon className={cn("size-4", color, className)} />;
}
