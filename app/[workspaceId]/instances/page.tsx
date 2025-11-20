import type { Metadata } from "next/types";
import { Suspense } from "react";
import InstancesPage from "@/components/features/instances/instances-page";
import InstancesPageSkeleton from "@/components/features/instances/instances-page-skeleton";
import AddInstanceSheet from "@/components/sheets/add-instance-sheet";

export const metadata: Metadata = {
  title: "Nodezen • Instances",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 overflow-hidden py-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Instances</h1>
        <AddInstanceSheet />
      </div>
      <Suspense fallback={<InstancesPageSkeleton />}>
        <InstancesPage params={params} />
      </Suspense>
    </div>
  );
}
