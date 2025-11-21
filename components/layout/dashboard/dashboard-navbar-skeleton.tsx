import { NodezenIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardNavbarSkeleton() {
  return (
    <div className="border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center">
            <NodezenIcon className="size-5" />
          </div>
          <Separator className="min-h-4" orientation="vertical" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-[83.81px]" />
            <Skeleton className="h-8 w-[76.19px]" />
            <Skeleton className="h-8 w-[82.36px]" />
            <Skeleton className="h-8 w-[84.14px]" />
            <Skeleton className="h-8 w-[57.83px]" />
            <Skeleton className="h-8 w-[52.68px]" />
            <Skeleton className="h-8 w-[66.98px]" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>
    </div>
  );
}
