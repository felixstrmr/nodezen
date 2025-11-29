import { Suspense } from "react";
import InstancesSkeleton from "@/components/features/instances/instances-skeleton";
import Instances from "@/components/features/instances/intances";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Suspense fallback={<InstancesSkeleton />}>
        <Instances params={params} />
      </Suspense>
    </div>
  );
}
