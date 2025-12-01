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
    <aside className="flex flex-col gap-3 rounded-lg bg-background p-3">
      <Link
        className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
        href={`/${workspaceId}`}
      >
        <NodezenIcon className="size-4" />
      </Link>
      <WorkspaceSidebarNavigation workspaceId={workspaceId} />
    </aside>
  );
}
