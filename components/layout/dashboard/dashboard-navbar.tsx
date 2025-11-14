import { ActivityIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Avatar from "@/components/common/avatar";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/queries/user";
import DashboardNavbarNavigation from "./dashboard-navbar-navigation";

export default async function DashboardNavbar() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col gap-3 border-b">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 pt-3">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-2" href="/dashboard">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary">
              <ActivityIcon className="size-4 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-2xl tracking-tight">NodeZen</h1>
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
        <DashboardNavbarNavigation />
      </div>
    </div>
  );
}
