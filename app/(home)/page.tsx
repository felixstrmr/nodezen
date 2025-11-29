import JoinWaitlistForm from "@/components/forms/join-waitlist-form";
import {
  HeartPulseIcon,
  LightningIcon,
  LockIcon,
  N8nIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto w-full max-w-4xl pt-24">
        <div>
          <Badge className="mb-6 text-muted-foreground" variant="outline">
            Currently in closed beta
          </Badge>
          <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs font-semibold text-6xl leading-tight tracking-tight">
            <span className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-blue-950/75">
                  <HeartPulseIcon className="size-4 text-blue-500" />
                </div>
                <span>Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-green-950/75">
                  <LockIcon className="size-4 text-green-500" />
                </div>
                <span>protect</span>
              </div>
              <span>and</span>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-yellow-950/75">
                  <LightningIcon className="size-4 text-yellow-500" />
                </div>
                <span>optimize</span>
              </div>
            </span>
          </h1>
          <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-100 font-semibold text-6xl leading-tight tracking-tight">
            your{" "}
            <div className="inline-flex h-8 items-center justify-center rounded-md bg-rose-950/75 px-3">
              <N8nIcon className="w-8" />
            </div>{" "}
            automation infrastructure.
          </h1>
          <p className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-200 mt-3 max-w-lg text-lg text-muted-foreground">
            Monitor n8n workflows, track performance, and get instant alerts
            when workflows fail. Stay in control of your automation
            infrastructure.
          </p>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-300 mt-12">
            <JoinWaitlistForm />
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground text-xs">
              We'll send you an email when we launch.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
