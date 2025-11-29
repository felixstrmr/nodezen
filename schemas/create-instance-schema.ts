import z from "zod";

export const createInstanceSchema = z.object({
  workspaceId: z
    .uuid("Invalid workspace ID")
    .min(1, "Workspace ID is required"),
  name: z.string().min(1),
  description: z.string().optional(),
  n8nUrl: z.url("Invalid URL").min(1, "URL is required"),
  n8nApiKey: z.string().min(1, "API key is required"),
});
