import ExecutionsFilters from "@/components/features/executions/executions-filters";

export default function ExecutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full gap-1 overflow-hidden">
      <ExecutionsFilters />
      {children}
    </div>
  );
}
