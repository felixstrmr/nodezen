"use client";

import {
  ArchiveIcon,
  ChartLineIcon,
  MegaphoneIcon,
  WorkflowIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroImageTabs() {
  return (
    <Tabs defaultValue="analytics">
      <TabsList className="mx-auto gap-3 bg-transparent">
        <TabsTrigger
          className="text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="analytics"
        >
          <ChartLineIcon className="size-4 text-muted-foreground" />
          Analytics
        </TabsTrigger>
        <TabsTrigger
          className="text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="alerts"
        >
          <MegaphoneIcon className="size-4 text-muted-foreground" />
          Alerts
        </TabsTrigger>
        <TabsTrigger
          className="text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="events"
        >
          <WorkflowIcon className="size-4 text-muted-foreground" />
          Events
        </TabsTrigger>
        <TabsTrigger
          className="text-muted-foreground hover:bg-muted data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="backups"
        >
          <ArchiveIcon className="size-4 text-muted-foreground" />
          Backups
        </TabsTrigger>
      </TabsList>
      <div className="mx-auto aspect-video w-full max-w-5xl rounded-2xl bg-muted">
        <TabsContent value="analytics">todo</TabsContent>
        <TabsContent value="alerts">todo</TabsContent>
        <TabsContent value="events">todo</TabsContent>
        <TabsContent value="backups">todo</TabsContent>
      </div>
    </Tabs>
  );
}
