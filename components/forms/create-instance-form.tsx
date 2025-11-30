"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createInstanceAction } from "@/actions/create-instance-action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createInstanceSchema } from "@/schemas/create-instance-schema";

export default function CreateInstanceForm({
  workspaceId,
  setOpen,
}: {
  workspaceId: string;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof createInstanceSchema>>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      workspaceId,
      name: "",
      description: "",
      n8nUrl: "",
      n8nApiKey: "",
    },
  });

  const { execute, isExecuting } = useAction(createInstanceAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "create-instance-form",
      });
    },
    onSuccess: () => {
      toast.success("Instance created successfully", {
        id: "create-instance-form",
      });
      setOpen(false);
    },
  });

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={form.handleSubmit(execute)}
    >
      <FieldGroup className="px-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                autoFocus
                disabled={isExecuting}
                id="name"
                placeholder="Instance name"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                className="resize-none"
                rows={3}
                {...field}
                disabled={isExecuting}
                id="description"
                placeholder="Instance description"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <p className="font-semibold tracking-tight">Connection details</p>
        <Controller
          control={form.control}
          name="n8nUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="n8nUrl">URL</FieldLabel>
              <Input
                {...field}
                disabled={isExecuting}
                id="n8nUrl"
                placeholder="https://n8n.example.com"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="n8nApiKey"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="n8nApiKey">API Key</FieldLabel>
              <Input
                {...field}
                disabled={isExecuting}
                id="n8nUrl"
                placeholder="••••••••••••"
                required
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex items-center gap-2 rounded-md border border-yellow-500/15 bg-yellow-500/5 p-3">
          <AlertTriangleIcon className="size-4 shrink-0 text-yellow-500" />
          <p className="text-sm text-yellow-500">
            Keep in mind that only new executions will be included in metrics!
          </p>
        </div>
      </FieldGroup>
      <SheetFooter>
        <Button onClick={() => setOpen(false)} type="button" variant="outline">
          Cancel
        </Button>
        <Button isLoading={isExecuting} type="submit">
          Add instance
        </Button>
      </SheetFooter>
    </form>
  );
}
