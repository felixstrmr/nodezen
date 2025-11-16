import JoinWaitlistForm from "@/components/forms/join-waitlist-form";
import N8nIcon from "@/components/icons/n8n-icon";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <div className="flex size-full flex-col items-center pt-36 text-center">
      <Badge variant="secondary">
        <p>Currently in Waitlist Mode</p>
      </Badge>
      <h1 className="mt-6 max-w-xl font-semibold text-7xl tracking-tight">
        Keep your <N8nIcon className="inline-block size-12" /> n8n workflows
        running smoothly
      </h1>
      <p className="mt-3 max-w-lg text-lg text-muted-foreground">
        Monitor executions, track performance, and get instant alerts when
        workflows fail. Stay in control of your automation infrastructure.
      </p>
      <div className="mt-12 w-full max-w-96">
        <JoinWaitlistForm />
      </div>
    </div>
  );
}
