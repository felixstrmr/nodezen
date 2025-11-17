import BackupsList from "@/components/features/backups/backups-list";
import BackupsPageHeader from "@/components/features/backups/backups-page-header";
import { getBackups } from "@/queries/backup";

export default async function BackupsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const backups = await getBackups(workspaceSlug);

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <BackupsPageHeader backups={backups} />
      <BackupsList backups={backups} />
    </div>
  );
}
