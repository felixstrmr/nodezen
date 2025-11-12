import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardNavbarSkeleton() {
  return (
    <div className="border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 pt-3">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-6 w-[75.06px]" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[83.44px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[75.72px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[80.77px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[83.44px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[57.52px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[52.73px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-[67.53px] rounded-md" />
            <div className="h-px bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
