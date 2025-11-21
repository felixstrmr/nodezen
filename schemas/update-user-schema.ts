import z from "zod";

export const updateUserSchema = z.object({
    id: z.uuid().min(1, { message: "User ID is required" }),
    active_workspace: z.uuid().optional(),
});
