"use client";

import {
  ArchiveIcon,
  CalendarIcon,
  ChartLineIcon,
  MegaphoneIcon,
  WorkflowIcon,
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroImageTabs() {
  return (
    <Tabs defaultValue="analytics">
      <TabsList className="mx-auto gap-3 bg-transparent">
        <TabsTrigger
          className="h-7 text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="analytics"
        >
          <ChartLineIcon className="size-4 text-muted-foreground" />
          Analytics
        </TabsTrigger>
        <TabsTrigger
          className="h-7 text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="alerts"
        >
          <MegaphoneIcon className="size-4 text-muted-foreground" />
          Alerts
        </TabsTrigger>
        <TabsTrigger
          className="h-7 text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="events"
        >
          <WorkflowIcon className="size-4 text-muted-foreground" />
          Events
        </TabsTrigger>
        <TabsTrigger
          className="h-7 text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="backups"
        >
          <ArchiveIcon className="size-4 text-muted-foreground" />
          Backups
        </TabsTrigger>
      </TabsList>
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted p-3 shadow-lg/5">
        <TabsContent value="analytics">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="https://thfmstpphfvwuikxmssr.supabase.co/storage/v1/object/public/media/hero-image-1.webp"
            width={1080}
          />
        </TabsContent>
        <TabsContent value="alerts">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="https://thfmstpphfvwuikxmssr.supabase.co/storage/v1/object/public/media/hero-image-2.webp"
            width={1080}
          />
        </TabsContent>
        <TabsContent value="events">
          <div className="flex aspect-video w-[974px] items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex size-8 items-center justify-center rounded-md border bg-background">
                <CalendarIcon className="size-4 text-muted-foreground" />
              </div>
              <h1 className="mb-0.5 font-semibold text-xl tracking-tight">
                Coming soon...
              </h1>
              <p className="text-muted-foreground text-sm">
                We're working on this feature.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="backups">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="https://thfmstpphfvwuikxmssr.supabase.co/storage/v1/object/public/media/hero-image-3.webp"
            width={1080}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
