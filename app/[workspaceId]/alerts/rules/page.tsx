import { Suspense } from "react";
import AlertRulesPage from "@/components/features/alerts/alert-rules-page";
import AlertRulesPageSkeleton from "@/components/features/alerts/alert-rules-page-skeleton";

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<AlertRulesPageSkeleton />}>
      <AlertRulesPage params={params} />
    </Suspense>
  );
}
