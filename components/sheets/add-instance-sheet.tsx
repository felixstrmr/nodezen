"use client";

import React from "react";
import AddInstanceForm from "@/components/forms/add-instance-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AddInstanceSheet() {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button>Add Instance</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Instance</SheetTitle>
        </SheetHeader>
        <AddInstanceForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
