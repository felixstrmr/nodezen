import { createClient } from "@supabase/supabase-js";
import { schemaTask } from "@trigger.dev/sdk";
import z from "zod";
import type { Database } from "@/types/supabase";

const supabase = await createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export const syncInstanceTask = schemaTask({
  id: "sync-instance-task",
  schema: z.object({
    instanceId: z.string().min(1),
  }),
  run: async () => {},
});
