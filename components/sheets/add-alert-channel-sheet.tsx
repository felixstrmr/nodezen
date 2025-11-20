"use client";

import React from "react";
import AddChannelForm from "@/components/forms/add-alert-channel-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AddAlertChannelSheet() {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button>Add Channel</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Channel</SheetTitle>
        </SheetHeader>
        <AddChannelForm onOpenChangeAction={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
