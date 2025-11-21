import type { Metadata } from "next";
import { Suspense } from "react";
import AlertChannelsPage from "@/components/features/alerts/alert-channels-page";
import AlertChannelsPageSkeleton from "@/components/features/alerts/alert-channels-page-skeleton";

export const metadata: Metadata = {
  title: "Nodezen • Alert Channels",
};

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<AlertChannelsPageSkeleton />}>
      <AlertChannelsPage params={params} />
    </Suspense>
  );
}
