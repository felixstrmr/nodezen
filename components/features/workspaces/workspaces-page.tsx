import { redirect } from "next/navigation";
import WorkspacesCard from "@/components/features/workspaces/workspaces-card";
import { getUser } from "@/queries/user";
import { getWorkspaces } from "@/queries/workspace";

export default async function WorkspacesPage() {
  const [user, workspaces] = await Promise.all([getUser(), getWorkspaces()]);

  if (!user) {
    redirect("/signin");
  }

  if (workspaces.length === 0) {
    redirect("/setup");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {workspaces.map((workspace) => (
        <WorkspacesCard
          key={workspace.id}
          userId={user.id}
          workspace={workspace}
        />
      ))}
    </div>
  );
}
