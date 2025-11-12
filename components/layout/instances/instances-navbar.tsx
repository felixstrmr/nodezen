import Link from "next/link";
import { redirect } from "next/navigation";
import Avatar from "@/components/common/avatar";
import InstancesNavbarNavigation from "@/components/layout/instances/Instances-navbar-navigation";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/queries/user";

export default async function InstancesNavbar() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col gap-3 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 pt-3">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-2" href="/app">
            <div className="size-6 rounded-sm bg-primary" />
            <h1 className="font-bold text-lg tracking-tight">NodeZen</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href={"https://nodezen.userjot.com"}
              passHref
              target="_blank"
            >
              Feedback
            </Link>
            <Avatar avatar={user.avatar} value={user.id} />
          </div>
        </div>
        <InstancesNavbarNavigation />
      </div>
    </div>
  );
}
