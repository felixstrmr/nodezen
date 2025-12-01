import { Spinner } from "@/components/ui/spinner";

export default function WorkspaceSidebarSkeleton() {
  return (
    <aside className="flex min-w-14 max-w-14 flex-col items-center justify-center rounded-lg bg-background">
      <Spinner />
    </aside>
  );
}
