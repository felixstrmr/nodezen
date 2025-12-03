import BackupsTable from "@/components/features/backups/backups-table";
import { BackupIcon } from "@/components/icons";
import { getBackups } from "@/queries/backups";

export default async function Backups({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { backups, error: backupsError } = await getBackups(workspaceId);

  if (backupsError) {
    return <div>Error: {backupsError?.message}</div>;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex h-8 items-center gap-2">
          <BackupIcon className="size-4 text-muted-foreground opacity-75" />
          <h1 className="font-semibold text-xl tracking-tight">Backups</h1>
          <span className="text-muted-foreground text-sm">
            {backups.length}
          </span>
        </div>
      </div>
      <BackupsTable backups={backups} />
    </div>
  );
}
