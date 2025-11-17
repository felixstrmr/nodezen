import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function BackupsPageSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        <Skeleton className="h-[67.9px] w-full rounded-lg" />
        <Skeleton className="h-[67.9px] w-full rounded-lg" />
        <Skeleton className="h-[67.9px] w-full rounded-lg" />
        <Skeleton className="h-[67.9px] w-full rounded-lg" />
      </div>
      <div className="flex size-full items-center justify-center rounded-lg border">
        <Spinner />
      </div>
    </div>
  );
}
