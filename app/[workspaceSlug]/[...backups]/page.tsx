import type { Metadata } from "next/types";
import { Suspense } from "react";
import BackupsPage from "@/components/features/backups/backups-page";
import BackupsPageSkeleton from "@/components/features/backups/backups-page-skeleton";

export const metadata: Metadata = {
  title: "Nodezen • Executions",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string; backups: string[] }>;
}) {
  return (
    <div className="mx-auto flex size-full max-w-7xl flex-col gap-6 overflow-hidden py-6">
      <div className="flex h-8 shrink-0 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Backups</h1>
      </div>
      <Suspense fallback={<BackupsPageSkeleton />}>
        <BackupsPage params={params} />
      </Suspense>
    </div>
  );
}
