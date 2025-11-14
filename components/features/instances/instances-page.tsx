import { ServerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInstances } from "@/queries/instance";
import type { Instance } from "@/types";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/utils/ui";

export default async function InstancesPage() {
  const instances = await getInstances();

  return (
    <div className="grid size-full grid-cols-2 gap-3">
      {instances.map((instance) => (
        <InstanceCard instance={instance} key={instance.id} />
      ))}
    </div>
  );
}

function InstanceCard({ instance }: { instance: Instance }) {
  const instanceUrl = instance.url.replace("https://", "");

  return (
    <div className="flex gap-3 rounded-lg border border-border/50 bg-muted/35 p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted">
        <ServerIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h3 className="mb-0.5 font-bold tracking-tight">{instance.name}</h3>
          <Badge className="capitalize" variant="outline">
            <div
              className={cn(
                "size-2 rounded-full",
                instance.status === "connected" ? "bg-green-500" : "bg-red-500"
              )}
            />
            {instance.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{instanceUrl}</p>
        <p className="mt-3 text-muted-foreground text-sm">
          Last Check: {formatRelativeTime(instance.last_status_check_at ?? "")}
        </p>
      </div>
    </div>
  );
}
