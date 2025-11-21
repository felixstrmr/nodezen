"use client";

import React from "react";
import AddAlertRuleForm from "@/components/forms/add-alert-rule-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Database } from "@/types/supabase";

type AlertChannel = Database["public"]["Tables"]["alert_channels"]["Row"];
type WorkflowOption = { id: string; name: string; instanceId: string };
type InstanceOption = { id: string; name: string };

export default function AddAlertRuleSheet({
  workspaceId,
  channels,
  workflows,
  instances,
}: {
  workspaceId: string;
  channels: AlertChannel[];
  workflows: WorkflowOption[];
  instances: InstanceOption[];
}) {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button>Add Rule</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Alert Rule</SheetTitle>
        </SheetHeader>
        <AddAlertRuleForm
          channels={channels}
          instances={instances}
          onOpenChangeAction={setOpen}
          workflows={workflows}
          workspaceId={workspaceId}
        />
      </SheetContent>
    </Sheet>
  );
}
