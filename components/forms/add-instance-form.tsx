"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { addInstanceAction } from "@/actions/add-instance-action";
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
import { addInstanceSchema } from "@/schemas/add-instance-schema";

export default function AddInstanceForm(props: {
  setOpen: (open: boolean) => void;
}) {
  const { setOpen } = props;

  const form = useForm<z.infer<typeof addInstanceSchema>>({
    resolver: zodResolver(addInstanceSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      api_key: "",
    },
  });

  const { execute, isExecuting } = useAction(addInstanceAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "add-instance-form",
      });
    },
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <form className="h-full" onSubmit={form.handleSubmit(execute)}>
      <FieldGroup className="h-full">
        <div className="space-y-8 px-4">
          <div className="space-y-4">
            <h2 className="text-muted-foreground text-sm">Details</h2>
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
                    placeholder="My n8n Instance"
                    required
                    type="text"
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
                  <FieldLabel htmlFor="description">
                    Description (optional)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    className="resize-none"
                    disabled={isExecuting}
                    id="description"
                    placeholder="Enter a description..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-muted-foreground text-sm">Configuration</h2>
            <div className="space-y-2">
              <Controller
                control={form.control}
                name="url"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="url">URL</FieldLabel>
                    <Input
                      {...field}
                      disabled={isExecuting}
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
            </div>

            <Controller
              control={form.control}
              name="api_key"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="api_key">API Key</FieldLabel>
                  <Input
                    {...field}
                    disabled={isExecuting}
                    id="api_key"
                    placeholder="••••••••••••"
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
        <SheetFooter>
          <Button
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button isLoading={isExecuting} type="submit">
            Add Instance
          </Button>
        </SheetFooter>
      </FieldGroup>
    </form>
  );
}
