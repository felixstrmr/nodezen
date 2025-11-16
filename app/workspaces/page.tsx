import { Suspense } from "react";
import WorkspacesPage from "@/components/features/workspaces/workspaces-page";
import WorkspacesPageSkeleton from "@/components/features/workspaces/workspaces-page-skeleton";

export default function Page() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="font-semibold text-2xl tracking-tight">
          Select Workspace
        </h1>
        <Suspense fallback={<WorkspacesPageSkeleton />}>
          <WorkspacesPage />
        </Suspense>
      </div>
    </div>
  );
}
