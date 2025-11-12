"use client";

import React from "react";
import CreateInstanceForm from "@/components/forms/create-instance-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateInstanceDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Create Instance</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Instance</DialogTitle>
        </DialogHeader>
        <CreateInstanceForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
