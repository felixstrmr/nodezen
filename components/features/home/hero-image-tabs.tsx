"use client";

import {
  ArchiveIcon,
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
      <div className="rounded-2xl border border-border/50 bg-muted p-3 shadow-lg/5">
        <TabsContent value="analytics">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="/hero.jpg"
            width={1080}
          />
        </TabsContent>
        <TabsContent value="alerts">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="/hero.jpg"
            width={1080}
          />
        </TabsContent>
        <TabsContent value="events">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="/hero.jpg"
            width={1080}
          />
        </TabsContent>
        <TabsContent value="backups">
          <Image
            alt="Hero Image"
            className="aspect-video size-full rounded-lg"
            height={1920}
            src="/hero.jpg"
            width={1080}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
