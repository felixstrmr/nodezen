import { Suspense } from "react";
import Workspaces from "@/components/features/workspaces/workspaces";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Workspaces />
    </Suspense>
  );
}
