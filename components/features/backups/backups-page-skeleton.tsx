import { Spinner } from "@/components/ui/spinner";

export default function BackupsPageSkeleton() {
  return (
    <div className="flex size-full flex-col rounded-lg border">
      <div className="grid grid-cols-[1fr_15rem_15rem] rounded-t-lg bg-accent/30 p-3">
        <p>Name</p>
        <p>Size</p>
        <p>Created</p>
      </div>
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
}
