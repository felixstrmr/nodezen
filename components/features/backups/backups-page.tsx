import { DatabaseIcon } from "lucide-react";
import { notFound } from "next/navigation";
import BackupsList from "@/components/features/backups/backups-list";
import BackupsPageHeader from "@/components/features/backups/backups-page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getBackups } from "@/queries/backup";
import { getWorkspace } from "@/queries/workspace";

export default async function BackupsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const [backups, workspace] = await Promise.all([
    getBackups(workspaceId),
    getWorkspace(workspaceId),
  ]);

  if (!workspace) {
    notFound();
  }

  if (workspace.subscription === "free") {
    return <div>Upgrade to pro to enable backups.</div>;
  }

  if (backups.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DatabaseIcon />
          </EmptyMedia>
          <EmptyTitle>No backups yet</EmptyTitle>
          <EmptyDescription>
            Backups will be created automatically when workflows are updated.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <BackupsPageHeader backups={backups} workspace={workspace} />
      <BackupsList backups={backups} />
    </div>
  );
}
