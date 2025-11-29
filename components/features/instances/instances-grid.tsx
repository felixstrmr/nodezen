import { InstanceIcon } from "@/components/icons";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Instance } from "@/types";

export default function InstancesGrid({
  instances,
}: {
  instances: Instance[];
}) {
  if (instances.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InstanceIcon />
          </EmptyMedia>
          <EmptyTitle>It's empty here</EmptyTitle>
          <EmptyDescription>Add your first instance to start</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid w-full grid-cols-4 p-3">
      {instances.map((instance) => (
        <div className="rounded-md border p-3" key={instance.id}>
          <h2>{instance.name}</h2>
        </div>
      ))}
    </div>
  );
}
