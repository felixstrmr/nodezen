import { ArrowUpRightIcon, MoreVerticalIcon, ServerIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInstances } from "@/queries/instance";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/ui";

export default async function InstancesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const instances = await getInstances(workspaceSlug);

  const statusBadgeVariants = {
    connected: "bg-green-100 border border-green-200 text-green-600",
    disconnected: "bg-red-100 border border-red-200 text-red-600",
    unknown: "bg-yellow-100 border border-yellow-200 text-yellow-600",
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {instances.map((instance) => (
        <div
          className="relative flex flex-col gap-6 rounded-lg border p-3"
          key={instance.id}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100">
              <ServerIcon className="size-4 text-blue-600" />
            </div>
            <div className="-space-y-0.5">
              <h2 className="text-sm">{instance.name}</h2>
              <Link
                className="group text-muted-foreground text-xs hover:underline"
                href={instance.url}
                passHref
                target="_blank"
              >
                {instance.url.replace("https://", "")}
                <ArrowUpRightIcon className="ml-1 hidden size-3.5 group-hover:inline-block" />
              </Link>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Badge
                className={cn(
                  "rounded-sm px-1 capitalize",
                  statusBadgeVariants[instance.status]
                )}
              >
                {instance.status}
              </Badge>
              <Button size="icon" variant="ghost">
                <MoreVerticalIcon />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <p className="text-muted-foreground text-sm">Uptime</p>
            <p className="text-sm">-</p>
            <p className="text-muted-foreground text-sm">Last Sync</p>
            <p className="text-muted-foreground text-sm">
              {formatRelativeTime(instance.last_sync_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
