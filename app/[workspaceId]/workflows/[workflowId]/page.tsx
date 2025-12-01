export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string; workflowId: string }>;
}) {
  return <div>WorkflowPage</div>;
}