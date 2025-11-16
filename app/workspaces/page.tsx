import { Suspense } from "react";
import WorkspacesPage from "@/components/features/workspaces/workspaces-page";
import WorkspacesPageSkeleton from "@/components/features/workspaces/workspaces-page-skeleton";

export default function Page() {
  return (
    <div className="flex size-full items-center justify-center">
      <Suspense fallback={<WorkspacesPageSkeleton />}>
        <WorkspacesPage />
      </Suspense>
    </div>
  );
}
