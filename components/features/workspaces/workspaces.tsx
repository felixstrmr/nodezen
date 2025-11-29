import { redirect } from "next/navigation";
import { getWorkspaces } from "@/queries/workspaces";

export default async function Workspaces() {
  const { workspaces, error } = await getWorkspaces();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (workspaces.length === 0) {
    redirect("/setup");
  }

  return <pre>{JSON.stringify(workspaces, null, 2)}</pre>;
}
