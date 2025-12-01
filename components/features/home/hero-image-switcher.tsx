"use client";

import {
  BellIcon,
  ChartBarIcon,
  DatabaseIcon,
  MonitorIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/ui";

const TABS = [
  {
    label: "Analytics",
    value: "analytics",
    icon: ChartBarIcon,
  },
  {
    label: "Monitoring",
    value: "monitoring",
    icon: MonitorIcon,
  },
  {
    label: "Alerts",
    value: "alerts",
    icon: BellIcon,
  },
  {
    label: "Backups",
    value: "backups",
    icon: DatabaseIcon,
  },
];

export default function HeroImageSwitcher() {
  const [activeTab, setActiveTab] = useState<string>("analytics");

  return (
    <div className="flex flex-col">
      <div className="grid h-16 min-h-16 grid-cols-4 bg-muted text-sm">
        {TABS.map((tab) => (
          <button
            className="group flex size-full cursor-pointer items-center justify-center border-r p-1.5 first:border-x"
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            type="button"
          >
            <div
              className={cn(
                "flex size-full items-center justify-center gap-2 rounded-md border border-transparent transition-colors group-hover:border-border group-hover:bg-background group-hover:shadow-xs",
                activeTab === tab.value &&
                  "border-border bg-background shadow-xs"
              )}
            >
              <tab.icon className="size-4 text-muted-foreground" />
              {tab.label}
            </div>
          </button>
        ))}
      </div>
      <div className="aspect-video size-full border bg-muted p-1.5">
        {activeTab === "analytics" && (
          <Image
            alt="Analytics"
            className="aspect-video rounded-md border shadow-xs"
            height={1920}
            src="https://qjjarqeqcmhzqknguofp.supabase.co/storage/v1/object/public/media/hero-1.webp"
            width={1080}
          />
        )}
      </div>
    </div>
  );
}
