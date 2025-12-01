import type { Workflow } from "@/types";

export default function WorkflowsTable({
  workflows,
}: {
  workflows: Workflow[];
}) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-muted-foreground text-sm">
        <p>Name</p>
        <p>Instance</p>
      </div>
      <div className="flex flex-col">
        {workflows.map((workflow) => (
          <div
            className="grid grid-cols-4 border-b p-3 text-sm"
            key={workflow.id}
          >
            <div>
              <p>{workflow.name}</p>
            </div>
            <p>{workflow.instance.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
