import Link from "next/link";
import NodezenIcon from "@/components/icons/nodezen-icon";
import HomeNavbarNavigation from "@/components/layout/home/home-navbar-navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/queries/user";

export default async function HomeNavbar() {
  const user = await getUser();

  return (
    <div className="fixed top-0 right-0 left-0 z-50 mx-auto flex w-full max-w-4xl items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <NodezenIcon className="size-4" />
            </div>
            <span className="font-semibold text-2xl tracking-tight">
              Nodezen
            </span>
          </Link>
          <Badge
            className="rounded-sm bg-blue-100 px-1 text-blue-600 capitalize"
            variant="secondary"
          >
            <p>Beta</p>
          </Badge>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute left-1/2">
        <HomeNavbarNavigation />
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <Link
            className={buttonVariants({ variant: "default" })}
            href={`/${user.active_workspace}`}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href="/signin"
            >
              Sign in
            </Link>
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/signup"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
