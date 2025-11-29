"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { joinWaitlistAction } from "@/actions/join-waitlist-action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { joinWaitlistSchema } from "@/schemas/join-waitlist-schema";

export default function JoinWaitlistForm() {
  const form = useForm<z.infer<typeof joinWaitlistSchema>>({
    resolver: zodResolver(joinWaitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, isExecuting } = useAction(joinWaitlistAction, {
    onExecute: () => {
      toast.loading("Joining waitlist...", {
        id: "join-waitlist-form",
      });
    },
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "join-waitlist-form",
      });
    },
    onSuccess: () => {
      toast.success("Joined waitlist successfully", {
        id: "join-waitlist-form",
      });
    },
  });

  return (
    <form onSubmit={form.handleSubmit(execute)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex max-w-96 rounded-lg bg-input/30 p-1">
                <input
                  className="w-full pl-2 text-sm focus:outline-none"
                  {...field}
                  disabled={isExecuting}
                  placeholder="email@example.com"
                  required
                  type="email"
                />
                <Button isLoading={isExecuting} type="submit">
                  Join waitlist
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
