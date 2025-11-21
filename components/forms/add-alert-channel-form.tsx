"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, PlusIcon, TrashIcon, WebhookIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { addAlertChannelAction } from "@/actions/add-alert-channel-action";
import { DiscordIcon, SlackIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { addAlertChannelSchema } from "@/schemas/add-alert-channel-schema";

export default function AddAlertChannelForm(props: {
  workspaceId: string;
  onOpenChangeAction: (open: boolean) => void;
}) {
  const { workspaceId, onOpenChangeAction } = props;

  const form = useForm<z.infer<typeof addAlertChannelSchema>>({
    resolver: zodResolver(addAlertChannelSchema),
    defaultValues: {
      workspaceId,
      name: "",
      type: "email",
      recipients: [""],
    },
  });

  const [recipientsIds, setRecipientsIds] = useState<string[]>(() => [
    crypto.randomUUID(),
  ]);

  const { execute, isExecuting } = useAction(addAlertChannelAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "add-alert-channel-form",
      });
    },
    onSuccess: () => {
      onOpenChangeAction(false);
      toast.success("Alert channel created successfully", {
        id: "add-alert-channel-form",
      });
      form.reset({
        name: "",
        type: "email",
        recipients: [""],
      });
      setRecipientsIds([crypto.randomUUID()]);
    },
  });

  const recipients = form.watch("recipients");

  const addRecipient = () => {
    form.setValue("recipients", [...recipients, ""]);
    setRecipientsIds([...recipientsIds, crypto.randomUUID()]);
  };

  const updateRecipients = (index: number, value: string) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = value;
    form.setValue("recipients", updatedRecipients);
  };

  const removeRecipient = (index: number) => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    form.setValue("recipients", updatedRecipients);
    setRecipientsIds(recipientsIds.filter((_, i) => i !== index));
  };

  return (
    <form className="h-full" onSubmit={form.handleSubmit(execute)}>
      <FieldGroup className="h-full">
        <div className="space-y-8 px-4">
          <div className="space-y-4">
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
                    placeholder="My Email Channel"
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
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid} id="type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <MailIcon />
                        Email
                      </SelectItem>{" "}
                      <SelectItem disabled value="slack">
                        <SlackIcon />
                        Slack
                      </SelectItem>
                      <SelectItem disabled value="discord">
                        <DiscordIcon />
                        Discord
                      </SelectItem>
                      <SelectItem disabled value="webhook">
                        <WebhookIcon />
                        Webhook
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <div className="space-y-2">
              <Controller
                control={form.control}
                name="recipients"
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Recipients</FieldLabel>
                    <div className="space-y-2">
                      {recipients.map((recipient, index) => (
                        <div
                          className="relative flex gap-2"
                          key={recipientsIds[index]}
                        >
                          <Input
                            disabled={isExecuting}
                            id={`recipient-${recipientsIds[index]}`}
                            onChange={(e) =>
                              updateRecipients(index, e.target.value)
                            }
                            placeholder="notifications@example.com"
                            type="email"
                            value={recipient}
                          />
                          {recipients.length > 1 && (
                            <Button
                              className="-translate-y-1/2 absolute top-1/2 right-1 size-6"
                              disabled={isExecuting}
                              onClick={() => removeRecipient(index)}
                              size="icon-sm"
                              type="button"
                              variant="outline"
                            >
                              <TrashIcon className="size-3.5 text-red-600" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                className="w-full"
                disabled={isExecuting}
                onClick={addRecipient}
                size="sm"
                type="button"
                variant="ghost"
              >
                <PlusIcon className="size-3.5 text-muted-foreground" />
                Add Email
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={() => onOpenChangeAction(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button isLoading={isExecuting} type="submit">
            Add Channel
          </Button>
        </SheetFooter>
      </FieldGroup>
    </form>
  );
}
