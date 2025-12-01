import type { Execution, Workflow } from "@/types/n8n";

export class n8nClient {
  url: string;
  apiKey: string;

  constructor(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
  }

  async getStatus(): Promise<"connected" | "disconnected"> {
    try {
      const response = await fetch(`${this.url}/api/v1/workflows?limit=1`, {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      });

      if (!response.ok) {
        return "disconnected";
      }

      return "connected";
    } catch (error) {
      console.error(error);
      return "disconnected";
    }
  }

  async getWorkflows({
    cursor,
    limit = 100,
    excludePinnedData = true,
  }: {
    cursor?: string;
    limit?: number;
    excludePinnedData?: boolean;
  } = {}): Promise<Workflow[]> {
    const response = await fetch(
      `${this.url}/api/v1/workflows?excludePinnedData=${excludePinnedData}${cursor ? `&cursor=${cursor}` : ""}&limit=${limit}`,
      {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get workflows");
    }

    const { data, nextCursor } = await response.json();

    const filteredData = data.filter(
      (workflow: Workflow) => !workflow.isArchived
    );

    if (nextCursor) {
      const nextWorkflows = await this.getWorkflows({
        cursor: nextCursor,
        limit,
        excludePinnedData,
      });
      return [...filteredData, ...nextWorkflows];
    }

    return filteredData;
  }

  async getExecutions({
    cursor,
    limit = 100,
    includeData = true,
  }: {
    cursor?: string;
    limit?: number;
    includeData?: boolean;
  } = {}): Promise<Execution[]> {
    const response = await fetch(
      `${this.url}/api/v1/executions?includeData=${includeData}${cursor ? `&cursor=${cursor}` : ""}&limit=${limit}`,
      {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get executions");
    }

    const { data, nextCursor } = await response.json();

    const filteredData = data.filter(
      (execution: Execution) => execution.mode !== "manual"
    );

    if (nextCursor) {
      const nextExecutions = await this.getExecutions({
        cursor: nextCursor,
        limit,
        includeData,
      });
      return [...filteredData, ...nextExecutions];
    }

    return filteredData;
  }
}
