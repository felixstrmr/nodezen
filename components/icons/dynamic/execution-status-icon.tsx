import {
  CircleCheckIcon,
  CirclePauseIcon,
  CircleXIcon,
  Loader2Icon,
  OctagonXIcon,
} from "lucide-react";
import type { ExecutionStatus } from "@/types/n8n";

export default function ExecutionStatusIcon({
  status,
}: {
  status: ExecutionStatus;
}) {
  const Icon = {
    error: <OctagonXIcon className="size-4 text-red-500" />,
    success: <CircleCheckIcon className="size-4 text-green-500" />,
    waiting: <CirclePauseIcon className="size-4 text-yellow-500" />,
    running: <Loader2Icon className="size-4 animate-spin text-yellow-500" />,
    canceled: <CircleXIcon className="size-4 text-red-500" />,
  }[status];

  return Icon;
}
