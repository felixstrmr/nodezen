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
import type { AlertChannel, Instance, Workflow } from "@/types";

export default function AddAlertRuleSheet({
  workspaceId,
  channels,
  workflows,
  instances,
}: {
  workspaceId: string;
  channels: AlertChannel[];
  workflows: Workflow[];
  instances: Instance[];
}) {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button>Add Rule</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
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
