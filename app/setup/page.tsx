import { Suspense } from "react";
import Setup from "@/components/features/setup/setup";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Setup />
    </Suspense>
  );
}
