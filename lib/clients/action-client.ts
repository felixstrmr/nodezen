import { redirect } from "next/navigation";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { getUser } from "@/queries/user";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
    });
  },
  handleServerError(error, { metadata }) {
    console.error(metadata.name, error.message);

    return error.message;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return next({ ctx: { user } });
});
