import Link from "next/link";
import { NodezenIcon } from "@/components/icons";
import WorkspaceSidebarNavigation from "@/components/layout/workspace-sidebar-navigation";

export default async function WorkspaceSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <aside className="flex min-w-64 max-w-64 flex-col gap-3 rounded-lg bg-background p-3">
      <Link
        className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
        href={`/${workspaceId}`}
      >
        <NodezenIcon className="size-3.5" />
      </Link>
      <WorkspaceSidebarNavigation workspaceId={workspaceId} />
    </aside>
  );
}
