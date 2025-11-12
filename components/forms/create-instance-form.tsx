"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createInstanceAction } from "@/actions/create-instance-action";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInstanceSchema } from "@/schemas/create-instance-schema";

export default function CreateInstanceForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof createInstanceSchema>>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      api_key: "",
    },
  });

  const { execute, isExecuting } = useAction(createInstanceAction, {
    onExecute: () => {
      toast.loading("Creating instance...", {
        id: "create-instance-form",
      });
    },
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "create-instance-form",
      });
    },
    onSuccess: () => {
      toast.success("Instance created", {
        id: "create-instance-form",
      });
      setOpen(false);
    },
  });

  return (
    <form onSubmit={form.handleSubmit(execute)}>
      <FieldGroup>
        <div className="space-y-4 px-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  autoFocus
                  id="name"
                  placeholder="My Instance"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                  {...field}
                  id="description"
                  placeholder="My instance is used to..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="space-y-4 rounded-md bg-muted/50 p-4">
            <Controller
              control={form.control}
              name="url"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <Input
                    {...field}
                    id="url"
                    placeholder="https://n8n.example.com"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="api_key"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="apiKey">API Key</FieldLabel>
                  <Input
                    {...field}
                    id="apiKey"
                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                    required
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Field>
            <Button isLoading={isExecuting} type="submit">
              Create Instance
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
