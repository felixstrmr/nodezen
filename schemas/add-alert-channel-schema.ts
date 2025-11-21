import z from "zod";

export const addAlertChannelSchema = z.object({
  workspaceId: z.uuid().min(1, "Workspace is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["email"], {
    message: "Channel type is required",
  }),
  recipients: z
    .array(z.email())
    .min(1, "At least one email address is required"),
});
