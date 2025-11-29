import type { Workflow } from "@/types";

export default function WorkflowsTable({
  workflows,
}: {
  workflows: Workflow[];
}) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 border-b bg-accent/75 p-3 text-muted-foreground text-sm">
        <div>Name</div>
      </div>
      <div className="flex flex-col">
        {workflows.map((workflow) => (
          <div
            className="grid grid-cols-4 border-b p-3 text-sm"
            key={workflow.id}
          >
            {workflow.name}
          </div>
        ))}
      </div>
    </div>
  );
}
