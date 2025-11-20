import { redirect } from "next/navigation";
import SigninForm from "@/components/forms/signin-form";
import { getUser } from "@/queries/user";
import { getWorkspace } from "@/queries/workspace";

export default async function SigninPage() {
  const user = await getUser();

  if (user) {
    if (user.active_workspace) {
      const workspace = await getWorkspace(user.active_workspace);

      if (workspace) {
        redirect(`/${workspace.slug}`);
      }
    } else {
      redirect("/workspaces");
    }
  }

  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex flex-col gap-4">
        <SigninForm />
      </div>
    </div>
  );
}
