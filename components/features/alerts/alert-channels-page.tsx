import { MailIcon, MegaphoneIcon } from "lucide-react";
import AddAlertChannelSheet from "@/components/sheets/add-alert-channel-sheet";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getAlertChannels } from "@/queries/alert-channel";

export default async function AlertChannelsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const channels = await getAlertChannels(workspaceId);

  if (channels.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MegaphoneIcon />
          </EmptyMedia>
          <EmptyTitle>No alert channels yet</EmptyTitle>
          <EmptyDescription>
            Create an alert channel to receive alerts when rules are triggered.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddAlertChannelSheet />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => {
        const config = channel.config as { recipients?: string[] };
        const recipients = config?.recipients?.length;

        return (
          <div
            className="flex flex-col gap-4 rounded-lg border p-3"
            key={channel.id}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100">
                  <MailIcon className="size-4 text-blue-600" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-medium text-sm">{channel.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {recipients} recipients
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
