import { Suspense } from "react";
import InstanceNavbar from "@/components/layout/instance/instance-navbar";
import InstanceNavbarSkeleton from "@/components/layout/instance/instance-navbar-skeleton";

export default function InstanceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ instanceId: string }>;
}) {
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Suspense fallback={<InstanceNavbarSkeleton />}>
        <InstanceNavbar params={params} />
      </Suspense>
      {children}
    </div>
  );
}
