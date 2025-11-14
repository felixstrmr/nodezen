import { Input } from "@/components/ui/input";
import type { Instance } from "@/types";

export default function WorkflowsHeader({
  instances,
}: {
  instances: Instance[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="flex h-8 items-center font-semibold text-xl tracking-tight">
        Workflows
      </h2>
      <div>
        <Input placeholder="Search..." />
      </div>
    </div>
  );
}
