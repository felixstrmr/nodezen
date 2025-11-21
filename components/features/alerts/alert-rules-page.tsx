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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule) => (
          <div key={rule.id}>
            <h3>{rule.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
