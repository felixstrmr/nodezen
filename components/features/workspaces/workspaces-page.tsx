import Link from "next/link";
import { getWorkspaces } from "@/queries/workspace";

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();

  return (
    <div className="flex gap-1.5">
      {workspaces.map((workspace) => (
        <Link
          className="border p-3"
          href={`/${workspace.slug}`}
          key={workspace.id}
        >
          {workspace.name}
        </Link>
      ))}
    </div>
  );
}
