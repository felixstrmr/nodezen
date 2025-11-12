import z from "zod";

export const createInstanceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.url().min(1),
  api_key: z.string().min(1),
});
