import { EyeIcon, ShieldIcon, ZapIcon } from "lucide-react";
import HeroImageTabs from "@/components/features/home/hero-image-tabs";
import JoinWaitlistForm from "@/components/forms/join-waitlist-form";
import N8nIcon from "@/components/icons/n8n-icon";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-4xl px-3 pt-16">
        <div className="flex flex-col items-center">
          <Badge variant="secondary">
            <p>Currently in closed Beta</p>
          </Badge>
          <div className="flex flex-col items-center">
            <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs mt-6 font-semibold text-6xl leading-tight tracking-tight">
              <span className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-blue-100">
                    <EyeIcon className="size-4 text-blue-600" />
                  </div>
                  <span>Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-green-100">
                    <ShieldIcon className="size-4 text-green-600" />
                  </div>
                  <span>protect</span>
                </div>
                <span>and</span>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-yellow-100">
                    <ZapIcon className="size-4 text-yellow-600" />
                  </div>
                  <span>optimize</span>
                </div>
              </span>
            </h1>
            <h1 className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-100 font-semibold text-6xl leading-tight tracking-tight">
              your{" "}
              <div className="inline-flex size-8 items-center justify-center rounded-md bg-rose-100">
                <N8nIcon className="size-4" />
              </div>{" "}
              automation infrastructure.
            </h1>
          </div>
          <p className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-200 mt-3 max-w-lg text-center text-lg text-muted-foreground">
            Monitor n8n workflows, track performance, and get instant alerts
            when workflows fail. Stay in control of your automation
            infrastructure.
          </p>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs motion-delay-300 mt-12 w-full max-w-96">
            <JoinWaitlistForm />
          </div>
        </div>
      </div>
      <div className="mx-auto size-full max-w-5xl px-3 pt-32">
        <HeroImageTabs />
      </div>
    </div>
  );
}
