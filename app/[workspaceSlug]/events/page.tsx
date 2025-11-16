import type { Metadata } from "next/types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Nodezen • Events",
};

export default function Page() {
  return (
    <div className="mx-auto size-full max-w-7xl py-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Events</h1>
      </div>
      <div className="flex size-full items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Coming soon</EmptyTitle>
            <EmptyDescription>We're working on it</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
}
