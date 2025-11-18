import { notFound } from "next/navigation";
import BackupsList from "@/components/features/backups/backups-list";
import BackupsPageHeader from "@/components/features/backups/backups-page-header";
import { getBackups } from "@/queries/backup";
import { getWorkspaceBySlug } from "@/queries/workspace";

export default async function BackupsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const [backups, workspace] = await Promise.all([
    getBackups(workspaceSlug),
    getWorkspaceBySlug(workspaceSlug),
  ]);

  if (!workspace) {
    notFound();
  }

  if (workspace.subscription === "free") {
    return <div>Upgrade to pro to enable backups.</div>;
  }

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <BackupsPageHeader backups={backups} workspace={workspace} />
      <BackupsList backups={backups} />
    </div>
  );
}
