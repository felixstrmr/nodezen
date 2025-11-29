"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createWorkspaceAction } from "@/actions/create-workspace-action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createWorkspaceSchema } from "@/schemas/create-workspace-schema";

export default function CreateWorkspaceForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const { execute, isExecuting } = useAction(createWorkspaceAction, {
    onExecute: () => {
      toast.loading("Creating workspace...", {
        id: "create-workspace-form",
      });
    },
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "create-workspace-form",
      });
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace created successfully", {
        id: "create-workspace-form",
      });
      router.push(`/${data.workspaceId}`);
    },
  });

  return (
    <form className="w-64" onSubmit={form.handleSubmit(execute)}>
      <FieldGroup>
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
                placeholder="Workspace name"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="mt-4">
          <Button isLoading={isExecuting} type="submit">
            Add workspace
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
