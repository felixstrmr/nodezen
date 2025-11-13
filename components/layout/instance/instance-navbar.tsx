import { ActivityIcon, ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Avatar from "@/components/common/avatar";
import InstanceNavbarNavigation from "@/components/layout/instance/instance-navbar-navigation";
import { buttonVariants } from "@/components/ui/button";
import { getInstances } from "@/queries/instance";
import { getUser } from "@/queries/user";

export default async function InstanceNavbar({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const { instanceId } = await params;

  const [user, instances] = await Promise.all([getUser(), getInstances()]);

  if (!user) {
    redirect("/signin");
  }

  const activeInstance = instances.find(
    (instance) => instance.id === instanceId
  );

  if (!activeInstance) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-3 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center" href="/app">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                <ActivityIcon className="size-4 text-primary-foreground" />
              </div>
            </Link>
            <p className="mr-2 ml-4 text-lg text-muted-foreground">/</p>
            <div className="flex h-8 items-center justify-center gap-2 rounded-md px-2 hover:bg-muted">
              <p className="text-sm">{activeInstance.name}</p>
              <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            </div>
          </div>
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
        <InstanceNavbarNavigation instanceId={instanceId} />
      </div>
    </div>
  );
}
