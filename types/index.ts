import type { SupabaseClient } from "@supabase/supabase-js";
import type { getBackups } from "@/queries/backups";
import type { getExecutions } from "@/queries/executions";
import type { getInstances } from "@/queries/instances";
import type {
  getWorkflowsTotalMetrics,
  getWorkspaceTotalMetrics,
} from "@/queries/metrics";
import type { getWorkflows } from "@/queries/workflows";
import type { Database } from "@/types/supabase";

export type Supabase = SupabaseClient<Database>;

export type WorkspaceSubscription =
  Database["public"]["Enums"]["workspace_subscriptions"];

export type Instance = Awaited<
  ReturnType<typeof getInstances>
>["instances"][number];

export type Workflow = Awaited<
  ReturnType<typeof getWorkflows>
>["workflows"][number];

export type Execution = Awaited<
  ReturnType<typeof getExecutions>
>["executions"][number];

export type TotalWorkflowMetric = Awaited<
  ReturnType<typeof getWorkflowsTotalMetrics>
>["metrics"][number];

export type Backup = Awaited<ReturnType<typeof getBackups>>["backups"][number];

export type TotalWorkspaceMetric = Awaited<
  ReturnType<typeof getWorkspaceTotalMetrics>
>["metrics"];
