import { InstanceIcon } from "@/components/icons";
import CreateInstanceSheet from "@/components/sheets/create-instance-sheet";
import { getInstances } from "@/queries/instances";

export default async function Instances({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { instances, error } = await getInstances(workspaceId);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <InstanceIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Instances</h1>
        </div>
        <CreateInstanceSheet workspaceId={workspaceId} />
      </div>
      <div className="grid w-full grid-cols-4 p-3">
        {instances.map((instance) => (
          <div className="rounded-md border p-3" key={instance.id}>
            <h2>{instance.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
