import { Spinner } from "@/components/ui/spinner";

export default function SettingsSidebarSkeleton() {
  return (
    <div className="flex min-w-64 max-w-64 flex-col rounded-lg bg-background">
      <Spinner />
    </div>
  );
}
