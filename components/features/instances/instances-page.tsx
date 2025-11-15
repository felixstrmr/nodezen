import { ServerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    connected: "bg-green-950 border border-green-900 text-green-500",
    disconnected: "bg-red-950 border border-red-900 text-red-500",
    unknown: "bg-yellow-950 border border-yellow-900 text-yellow-500",
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {instances.map((instance) => (
        <div
          className="rounded-lg border border-border/50 bg-accent/50 p-4"
          key={instance.id}
        >
          <div className="flex gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted">
              <ServerIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg tracking-tight">
                  {instance.name}
                </h2>
                <div className="ml-auto flex items-center gap-2">
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(instance.last_status_check_at)}
                  </p>
                  <Badge
                    className={cn(
                      "rounded-sm px-1 capitalize",
                      statusBadgeVariants[instance.status]
                    )}
                  >
                    {instance.status}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{instance.url}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
