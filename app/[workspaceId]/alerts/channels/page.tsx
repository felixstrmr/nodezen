import type { Metadata } from "next";
import { Suspense } from "react";
import AlertChannelsPage from "@/components/features/alerts/alert-channels-page";
import AlertChannelsPageSkeleton from "@/components/features/alerts/alert-channels-page-skeleton";
import AddAlertChannelSheet from "@/components/sheets/add-alert-channel-sheet";

export const metadata: Metadata = {
  title: "Nodezen • Alert Channels",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <div className="flex h-8 items-center justify-between">
        <h2 className="font-semibold text-lg tracking-tight">Channels</h2>
        <AddAlertChannelSheet />
      </div>
      <Suspense fallback={<AlertChannelsPageSkeleton />}>
        <AlertChannelsPage params={params} />
      </Suspense>
    </div>
  );
}
