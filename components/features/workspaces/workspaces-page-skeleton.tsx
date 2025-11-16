import { Spinner } from "@/components/ui/spinner";

export default function WorkspacesPageSkeleton() {
  return (
    <div className="flex size-full items-center justify-center">
      <Spinner />
    </div>
  );
}
