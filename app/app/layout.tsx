import { Suspense } from "react";
import AppNavbar from "@/components/layout/app/app-navbar";
import AppNavbarSkeleton from "@/components/layout/app/app-navbar-skeleton";

export default function InstancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Suspense fallback={<AppNavbarSkeleton />}>
        <AppNavbar />
      </Suspense>
      {children}
    </div>
  );
}
