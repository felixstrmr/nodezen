"use client";

import { useState } from "react";
import CreateInstanceForm from "@/components/forms/create-instance-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CreateInstanceSheet({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button>Add instance</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add instance</SheetTitle>
        </SheetHeader>
        <CreateInstanceForm setOpen={setOpen} workspaceId={workspaceId} />
      </SheetContent>
    </Sheet>
  );
}
