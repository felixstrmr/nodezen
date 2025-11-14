import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getWorkflow } from "@/queries/workflow";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;

  const workflow = await getWorkflow(workflowId);

  if (!workflow) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          href="/dashboard/workflows"
        >
          <ArrowLeftIcon className="size-3.5" />
        </Link>
        <h2 className="flex h-8 items-center font-semibold text-xl tracking-tight">
          {workflow.name}
        </h2>
        <Badge variant="secondary">{workflow.instance.name}</Badge>
      </div>
      <pre className="mt-6">{JSON.stringify(workflow, null, 2)}</pre>
    </div>
  );
}
