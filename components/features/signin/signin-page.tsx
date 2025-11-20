import { redirect } from "next/navigation";
import SigninForm from "@/components/forms/signin-form";
import NodezenIcon from "@/components/icons/nodezen-icon";
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
      <div className="flex flex-col">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <NodezenIcon className="size-4 text-primary-foreground" />
        </div>
        <div className="mt-4 mb-8">
          <h1 className="font-semibold text-2xl tracking-tight">
            Welcome back!
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to continue.
          </p>
        </div>
        <SigninForm />
      </div>
    </div>
  );
}
