import { Spinner } from "@/components/ui/spinner";

export default function WorkspaceSidebarSkeleton() {
  return (
    <aside className="flex min-w-64 max-w-64 flex-col items-center justify-center rounded-lg bg-background">
      <Spinner />
    </aside>
  );
}
