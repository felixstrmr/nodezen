import z from "zod";

export const addInstanceSchema = z.object({
  workspaceId: z.uuid().min(1, "Workspace is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  url: z.url().min(1, "URL is required"),
  api_key: z.string().min(1, "API Key is required"),
});
