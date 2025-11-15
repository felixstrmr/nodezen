import { createSafeActionClient } from "next-safe-action";
import z from "zod";
import { supabaseClient } from "@/lib/clients/supabase-client";
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
  const supabase = await supabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const userData = await getUser();

  if (!userData) {
    throw new Error("User not found");
  }

  return next({
    ctx: {
      supabase,
      user: user.id,
      workspace: userData.active_workspace,
    },
  });
});
