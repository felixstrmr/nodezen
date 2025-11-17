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
    error: <OctagonXIcon className="size-4 text-red-600" />,
    success: <CircleCheckIcon className="size-4 text-green-600" />,
    waiting: <CirclePauseIcon className="size-4 text-yellow-600" />,
    running: <Loader2Icon className="size-4 animate-spin text-yellow-600" />,
    canceled: <CircleXIcon className="size-4 text-red-600" />,
  }[status];

  return Icon;
}
