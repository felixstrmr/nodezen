import { Suspense } from "react";
import InstancesNavbar from "@/components/layout/instances/instances-navbar";
import InstancesNavbarSkeleton from "@/components/layout/instances/instances-navbar-skeleton";

export default function InstancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Suspense fallback={<InstancesNavbarSkeleton />}>
        <InstancesNavbar />
      </Suspense>
      {children}
    </div>
  );
}
