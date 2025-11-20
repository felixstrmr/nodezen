import type { Metadata } from "next";
import { Suspense } from "react";
import AlertsNavbar from "@/components/layout/alerts/alerts-navbar";

export const metadata: Metadata = {
  title: "Nodezen • Alerts",
};

export default function AlertsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="mx-auto flex size-full max-w-7xl flex-col gap-6 overflow-hidden py-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Alerts</h1>
      </div>
      <div className="flex size-full flex-col gap-3">
        <Suspense>
          <AlertsNavbar params={params} />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
