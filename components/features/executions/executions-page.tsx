import ExecutionCards from "@/components/features/executions/executions-cards";
import ExecutionsHeader from "@/components/features/executions/executions-header";
import { getExecutions } from "@/queries/execution";

export default async function ExecutionsPage() {
  const executions = await getExecutions();

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <ExecutionsHeader executions={executions} />
      <ExecutionCards executions={executions} />
    </div>
  );
}
