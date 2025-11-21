import Link from "next/link";
import { NodezenIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeNavbarSkeleton() {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl items-center justify-between p-3">
      <div className="flex items-center gap-2">
        <Link className="flex items-center gap-2" href="/">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <NodezenIcon className="size-4" />
          </div>
          <span className="font-semibold text-2xl tracking-tight">Nodezen</span>
        </Link>
        <Badge
          className="rounded-sm bg-blue-100 px-1 text-blue-600 capitalize"
          variant="secondary"
        >
          <p>Beta</p>
        </Badge>
      </div>
      <div className="-translate-x-1/2 absolute left-1/2 flex items-center gap-2">
        <Skeleton className="h-8 w-[44.64px]" />
        <Skeleton className="h-8 w-[59.41px]" />
        <Skeleton className="h-8 w-[98.61px]" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[66.13px]" />
        <Skeleton className="h-8 w-[93.34px]" />
      </div>
    </div>
  );
}
