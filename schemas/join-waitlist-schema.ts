import z from "zod";

export const joinWaitlistSchema = z.object({
  email: z.email().min(1, "Email is required"),
});
