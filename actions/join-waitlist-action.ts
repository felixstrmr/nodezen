"use server";

import { actionClient } from "@/lib/clients/action-client";
import { loopsClient } from "@/lib/clients/loops-client";
import { joinWaitlistSchema } from "@/schemas/join-waitlist-schema";

export const joinWaitlistAction = actionClient
  .metadata({ name: "joinWaitlistAction" })
  .inputSchema(joinWaitlistSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    try {
      const response = await loopsClient.createContact({
        email,
        mailingLists: { cmeypeas99dzm0iz94bmg1tw5: true },
      });

      return response;
    } catch (error) {
      throw new Error("Failed to join waitlist", { cause: error });
    }
  });
