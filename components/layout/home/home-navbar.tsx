import Link from "next/link";
import NodezenIcon from "@/components/icons/nodezen-icon";
import { buttonVariants } from "@/components/ui/button";

export default function HomeNavbar() {
  return (
    <div className="fixed top-3 right-0 left-0 mx-auto flex w-full max-w-3xl items-center justify-between rounded-lg border border-border/50 bg-accent/30 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link className="flex items-center" href="/">
          <div className="flex size-8 items-center justify-center">
            <NodezenIcon className="size-5" />
          </div>
          <span className="font-semibold text-2xl tracking-tight">Nodezen</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link className={buttonVariants({ variant: "ghost" })} href="/signin">
          Sign in
        </Link>
        <Link className={buttonVariants({ variant: "default" })} href="/signup">
          Get started
        </Link>
      </div>
    </div>
  );
}
