import Link from "next/link";
import { NodezenIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/queries/users";

export default async function HomeNavbar() {
  const { user } = await getUser();

  return (
    <nav className="mx-auto flex w-full max-w-4xl items-center justify-between py-3">
      <Link className="flex items-center gap-1.5" href="/">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <NodezenIcon className="size-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-2xl tracking-tight">Nodezen</span>
      </Link>
      <div className="flex items-center gap-2">
        {user ? (
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href={`/${user.active_workspace}`}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              className={buttonVariants({ variant: "secondary" })}
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
    </nav>
  );
}
