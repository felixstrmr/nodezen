import { Suspense } from "react";
import CreateInstanceDialog from "@/components/dialogs/create-instance-dialog";
import InstancesPage from "@/components/features/instances-page";
import InstancesPageSkeleton from "@/components/features/instances-page-skeleton";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-3 py-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Instances</h2>
        <CreateInstanceDialog />
      </div>
      <Suspense fallback={<InstancesPageSkeleton />}>
        <InstancesPage />
      </Suspense>
    </div>
  );
}
