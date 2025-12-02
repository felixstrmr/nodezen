import { MegaphoneIcon } from "lucide-react";
import HeroImageSwitcher from "@/components/features/home/hero-image-switcher";
import JoinWaitlistForm from "@/components/forms/join-waitlist-form";
import {
  HeartPulseIcon,
  LightningIcon,
  LockIcon,
  N8nIcon,
} from "@/components/icons";

export default function Page() {
  return (
    <div className="flex flex-col pt-14">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-4">
        <div
          className="size-full h-32 border-x"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0px, var(--muted) 0.5px, var(--background) 5px)",
          }}
        />
        <div className="size-full h-32 border-r border-dashed" />
        <div className="size-full h-32 border-r" />
        <div
          className="size-full h-32 border-r"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0px, var(--muted) 0.5px, var(--background) 5px)",
          }}
        />
      </div>
      <section className="mx-auto flex w-full max-w-5xl flex-col">
        <div className="border p-16">
          <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs font-semibold text-6xl leading-tight tracking-tight">
            <span className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950/75">
                  <HeartPulseIcon className="size-4 text-blue-600" />
                </div>
                <span>Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-green-100 dark:bg-green-950/75">
                  <LockIcon className="size-4 text-green-600" />
                </div>
                <span>protect</span>
              </div>
              <span>and</span>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-950/75">
                  <LightningIcon className="size-4 text-yellow-600" />
                </div>
                <span>optimize</span>
              </div>
            </span>
          </h1>
          <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-100 font-semibold text-6xl leading-tight tracking-tight">
            your{" "}
            <div className="inline-flex h-8 items-center justify-center rounded-md bg-rose-100 px-3 dark:bg-rose-950/75">
              <N8nIcon className="w-8" />
            </div>{" "}
            automation infrastructure.
          </h1>
          <p className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-200 mt-3 max-w-lg text-lg text-muted-foreground">
            Monitor n8n workflows, track performance, and get instant alerts
            when workflows fail. Stay in control of your automation
            infrastructure.
          </p>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-300 mt-9 flex w-full flex-col justify-center">
            <JoinWaitlistForm />
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground text-xs">
              <MegaphoneIcon className="innline-block size-3.5" />
              We'll send you an email when we launch.
            </p>
          </div>
        </div>
        <HeroImageSwitcher />
      </section>
      <section className="mx-auto flex size-full min-h-64 w-full max-w-5xl flex-col border-x" />
    </div>
  );
}
