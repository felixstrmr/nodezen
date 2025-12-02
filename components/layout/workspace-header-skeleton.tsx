import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceHeaderSkeleton() {
  return (
    <nav className="flex items-center justify-between rounded-lg bg-background p-3">
      <Skeleton className="size-7 rounded-md" />
      <Skeleton className="size-8 rounded-full" />
    </nav>
  );
}
