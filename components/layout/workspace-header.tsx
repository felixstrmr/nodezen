import { redirect } from "next/navigation";
import WorkspaceHeaderBreadcrumb from "@/components/layout/workspace-header-breadcrumb";
import { getUser } from "@/queries/users";

export default async function WorkspaceHeader({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { user, error } = await getUser();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    redirect("/signin");
  }

  return (
    <nav className="flex items-center justify-between rounded-lg bg-background p-3">
      <div className="flex h-8 items-center">
        <WorkspaceHeaderBreadcrumb workspaceId={workspaceId} />
      </div>
      <div className="flex size-7 items-center justify-center rounded-full bg-accent">
        <p className="text-sm">{user.email[0]}</p>
      </div>
    </nav>
  );
}
