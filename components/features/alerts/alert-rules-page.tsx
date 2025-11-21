import { MegaphoneIcon, SplitIcon } from "lucide-react";
import Link from "next/link";
import AddAlertRuleSheet from "@/components/sheets/add-alert-rule-sheet";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getAlertChannels } from "@/queries/alert-channel";
import { getAlertRules } from "@/queries/alert-rule";
import { getInstances } from "@/queries/instance";
import { getWorkflows } from "@/queries/workflow";

export default async function AlertRulesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const [rules, channels, workflows, instances] = await Promise.all([
    getAlertRules(workspaceId),
    getAlertChannels(workspaceId),
    getWorkflows(workspaceId),
    getInstances(workspaceId),
  ]);

  if (rules.length === 0) {
    if (channels.length === 0) {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex h-8 items-center">
              <h2 className="font-semibold text-lg tracking-tight">Rules</h2>
            </div>
          </div>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MegaphoneIcon />
              </EmptyMedia>
              <EmptyTitle>No alert rules yet</EmptyTitle>
              <EmptyDescription>
                Create a channel to receive alerts when rules are triggered.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                className={buttonVariants({ variant: "default" })}
                href={`/${workspaceId}/alerts/channels`}
              >
                Add Channel
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex h-8 items-center">
            <h2 className="font-semibold text-lg tracking-tight">Rules</h2>
          </div>
          {channels.length > 0 && (
            <AddAlertRuleSheet
              channels={channels}
              instances={instances}
              workflows={workflows}
              workspaceId={workspaceId}
            />
          )}
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SplitIcon />
            </EmptyMedia>
            <EmptyTitle>No alert rules yet</EmptyTitle>
            <EmptyDescription>
              Create an alert rule to monitor your workflows and get notified
              when conditions are met.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddAlertRuleSheet
              channels={channels}
              instances={instances}
              workflows={workflows}
              workspaceId={workspaceId}
            />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex h-8 items-center">
          <h2 className="font-semibold text-lg tracking-tight">Rules</h2>
        </div>
        <AddAlertRuleSheet
          channels={channels}
          instances={instances}
          workflows={workflows}
          workspaceId={workspaceId}
        />
      </div>
      <div className="flex flex-col rounded-lg border">
        <div className="sticky top-0 z-10 grid grid-cols-[1fr_10rem_20rem_15rem] gap-4 rounded-t-lg border-b bg-accent p-3 text-muted-foreground text-sm backdrop-blur-sm">
          <p>Name</p>
          <p>Instance</p>
          <p>Workflow</p>
          <p>Channels</p>
        </div>
        {rules.map((rule) => (
          <div
            className="grid grid-cols-[1fr_10rem_20rem_15rem] items-center gap-4 border-b p-3 last:border-b-0 hover:bg-accent"
            key={rule.id}
          >
            <h3 className="text-sm">{rule.name}</h3>
            <p className="text-sm">{rule.instance?.name ?? "All"}</p>
            {rule.workflow ? (
              <Link
                className="truncate text-sm hover:underline"
                href={`/${workspaceId}/workflows/${rule.workflow?.id}`}
              >
                {rule.workflow?.name}
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm">-</p>
            )}
            <p className="text-sm">
              {rule.channels.map((channel) => channel.channel.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
