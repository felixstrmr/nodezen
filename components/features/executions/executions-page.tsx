import ExecutionCards from "@/components/features/executions/executions-cards";
import { getExecutions } from "@/queries/execution";

export default async function ExecutionsPage() {
  const executions = await getExecutions();

  return (
    <div className="flex size-full flex-col gap-3 overflow-hidden">
      <ExecutionCards executions={executions} />
    </div>
  );
}
