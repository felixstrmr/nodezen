import Link from "next/link";
import { getWorkspaces } from "@/queries/workspace";

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();

  return (
    <div className="grid grid-cols-2 gap-3">
      {workspaces.map((workspace) => (
        <Link
          className="rounded-lg border p-3"
          href={`/${workspace.slug}`}
          key={workspace.id}
        >
          {workspace.name}
        </Link>
      ))}
    </div>
  );
}
