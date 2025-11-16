import { Suspense } from "react";
import SigninPage from "@/components/features/signin/signin-page";
import SigninPageSkeleton from "@/components/features/signin/signin-page-skeleton";

export default function Page() {
  return (
    <div className="flex size-full items-center justify-center">
      <Suspense fallback={<SigninPageSkeleton />}>
        <SigninPage />
      </Suspense>
    </div>
  );
}
