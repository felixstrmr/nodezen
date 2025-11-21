import { AlertTriangleIcon } from "lucide-react";
import AddAlertRuleSheet from "@/components/sheets/add-alert-rule-sheet";
import { Badge } from "@/components/ui/badge";
import { getAlertChannels } from "@/queries/alert-channel";
import { getAlertRules } from "@/queries/alert-rule";

export default async function AlertRulesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const [rules, channels] = await Promise.all([
    getAlertRules(workspaceId),
    getAlertChannels(workspaceId),
  ]);

  if (rules.length === 0) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <AlertTriangleIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">No rules yet</h3>
            <p className="max-w-sm text-muted-foreground text-sm">
              Create an alert rule to monitor your workflows and get notified
              when conditions are met.
            </p>
          </div>
          {channels.length > 0 ? (
            <AddAlertRuleSheet channels={channels} />
          ) : (
            <p className="text-muted-foreground text-xs">
              Create a notification channel first to receive alerts.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 items-center">
          <h2 className="font-semibold text-lg">Alert Rules</h2>
        </div>
        {channels.length > 0 && <AddAlertRuleSheet channels={channels} />}
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
                    {ruleConditions.map((condition, index) => (
                      <div
                        className="text-muted-foreground text-xs"
                        key={index}
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
