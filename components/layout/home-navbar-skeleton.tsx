import Link from "next/link";
import { NodezenIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeNavbarSkeleton() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex border-b bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between p-3">
        <Link className="flex items-center gap-1.5" href="/">
          <div className="flex size-8 items-center justify-center rounded-md bg-secondary">
            <NodezenIcon className="size-4 text-foreground" />
          </div>
          <span className="font-semibold text-2xl tracking-tight">NodeZEN</span>
        </Link>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[66.11px] rounded-md" />
          <Skeleton className="h-8 w-[93.33px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
