import { Suspense } from "react";
import Backups from "@/components/features/backups/backups";
import BackupsSkeleton from "@/components/features/backups/backups-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Suspense fallback={<BackupsSkeleton />}>
        <Backups params={params} />
      </Suspense>
    </div>
  );
}
