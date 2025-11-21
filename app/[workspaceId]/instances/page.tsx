import type { Metadata } from "next/types";
import { Suspense } from "react";
import InstancesPage from "@/components/features/instances/instances-page";
import InstancesPageSkeleton from "@/components/features/instances/instances-page-skeleton";

export const metadata: Metadata = {
  title: "Nodezen • Instances",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<InstancesPageSkeleton />}>
      <InstancesPage params={params} />
    </Suspense>
  );
}
