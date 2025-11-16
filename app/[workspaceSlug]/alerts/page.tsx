import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Nodezen • Alerts",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl py-6">
      <div className="flex h-8 items-center justify-between">
        <h1 className="font-semibold text-xl tracking-tight">Alerts</h1>
      </div>
    </div>
  );
}
