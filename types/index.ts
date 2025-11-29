import type { getInstances } from "@/queries/instances";
import type { Database } from "@/types/supabase";

export type Instance = Awaited<
  ReturnType<typeof getInstances>
>["instances"][number];

export type WorkspaceSubscription =
  Database["public"]["Enums"]["workspace_subscriptions"];
