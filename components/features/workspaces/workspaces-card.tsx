"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { updateUserAction } from "@/actions/update-user-action";
import type { Workspace } from "@/types";

export default function WorkspacesCard({
  workspace,
  userId,
}: {
  workspace: Workspace;
  userId: string;
}) {
  const router = useRouter();

  const { execute } = useAction(updateUserAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        id: "update-user-action",
      });
    },
    onSuccess: () => {
      router.push(`/${workspace.id}`);
    },
  });

  return (
    <button
      className="flex cursor-pointer items-start rounded-lg border p-3 hover:bg-accent"
      key={workspace.id}
      onClick={() => execute({ id: userId, active_workspace: workspace.id })}
      type="button"
    >
      {workspace.name}
    </button>
  );
}
