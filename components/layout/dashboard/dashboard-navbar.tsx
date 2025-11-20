import Link from "next/link";
import { redirect } from "next/navigation";
import Avatar from "@/components/common/avatar";
import NodezenIcon from "@/components/icons/nodezen-icon";
import DashboardNavbarNavigation from "@/components/layout/dashboard/dashboard-navbar-navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getWorkspaceUser } from "@/queries/workspace-user";

export default async function DashboardNavbar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspaceUser = await getWorkspaceUser(workspaceId);

  if (!workspaceUser) {
    redirect("/signin");
  }

  return (
    <div className="border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link
              className="flex size-8 items-center justify-center"
              href={`/${workspaceId}`}
            >
              <NodezenIcon className="size-5" />
            </Link>
            <Badge
              className="rounded-sm bg-blue-100 px-1 text-blue-600 capitalize"
              variant="secondary"
            >
              {workspaceUser.workspace.subscription}
            </Badge>
          </div>
          <Separator className="min-h-4" orientation="vertical" />
          <DashboardNavbarNavigation workspaceId={workspaceId} />
        </div>
        <Avatar
          avatar={workspaceUser.user.avatar}
          value={workspaceUser.user.email}
        />
      </div>
    </div>
  );
}
