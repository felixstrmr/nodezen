import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Avatar from "@/components/common/avatar";
import InstanceNavbarNavigation from "@/components/layout/instance/instance-navbar-navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getInstances } from "@/queries/instance";
import { getUser } from "@/queries/user";
import { cn } from "@/utils/ui";

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
              <div className="size-6 rounded-sm bg-primary" />
            </Link>
            <p className="mr-2 ml-4 text-muted-foreground">/</p>
            <div className="flex h-8 items-center justify-center gap-2 rounded-md px-2 hover:bg-muted">
              <p className="text-sm">{activeInstance.name}</p>
              <Badge className="capitalize" variant="outline">
                <div
                  className={cn(
                    "size-2 rounded-full",
                    activeInstance.status === "connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  )}
                />
                {activeInstance.status}
              </Badge>
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
