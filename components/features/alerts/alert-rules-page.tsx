import { MegaphoneIcon, SplitIcon } from "lucide-react";
import Link from "next/link";
import AddAlertRuleSheet from "@/components/sheets/add-alert-rule-sheet";
import { Badge } from "@/components/ui/badge";
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

  const sheetWorkflows = workflows.map((workflow) => ({
    id: workflow.id,
    name: workflow.name,
    instanceId: workflow.instance,
  }));

  const sheetInstances = instances.map((instance) => ({
    id: instance.id,
    name: instance.name,
  }));

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
              instances={sheetInstances}
              workflows={sheetWorkflows}
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
              instances={sheetInstances}
              workflows={sheetWorkflows}
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
        {channels.length > 0 && (
          <AddAlertRuleSheet
            channels={channels}
            instances={sheetInstances}
            workflows={sheetWorkflows}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule) => {
          const conditions = rule.conditions as {
            conditions?: Array<{
              metric: string;
              operator: string;
              threshold: number;
            }>;
            channelIds?: string[];
          };
          const ruleConditions = conditions?.conditions || [];
          const channelIds = conditions?.channelIds || [];

          return (
            <div
              className="flex flex-col gap-4 rounded-lg border p-4"
              key={rule.id}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{rule.name}</h3>
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {rule.description && (
                    <p className="text-muted-foreground text-xs">
                      {rule.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="font-medium text-xs">Conditions</p>
                  <div className="space-y-1">
                    {ruleConditions.map((condition) => (
                      <div
                        className="text-muted-foreground text-xs"
                        key={`${condition.metric}-${condition.operator}-${condition.threshold}`}
                      >
                        {condition.metric} {condition.operator}{" "}
                        {condition.threshold}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-xs">Channels</p>
                  <p className="text-muted-foreground text-xs">
                    {channelIds.length} channel
                    {channelIds.length !== 1 ? "s" : ""} configured
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
