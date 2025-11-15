import type { Execution, Workflow } from "@/types/n8n";

export class n8nClient {
  url: string;
  apiKey: string;

  constructor(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/api/v1/workflows`, {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async getWorkflows(): Promise<Workflow[]> {
    const response = await fetch(
      `${this.url}/api/v1/workflows?excludePinnedData=true`,
      {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get workflows");
    }

    const { data } = await response.json();

    return data;
  }

  async getExecutions(cursor?: string): Promise<Execution[]> {
    const response = await fetch(
      `${this.url}/api/v1/executions?limit=100${cursor ? `&cursor=${cursor}` : ""}`,
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

    if (nextCursor) {
      const nextExecutions = await this.getExecutions(nextCursor);
      return [...data, ...nextExecutions];
    }

    return data;
  }

  async getExecutionsByWorkflowId(
    workflowId: string,
    cursor?: string
  ): Promise<Execution[]> {
    const response = await fetch(
      `${this.url}/api/v1/executions?limit=100&workflowId=${workflowId}${cursor ? `&cursor=${cursor}` : ""}`,
      {
        headers: {
          "X-N8N-API-KEY": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get executions by workflow id");
    }

    const { data, nextCursor } = await response.json();

    if (nextCursor) {
      const nextExecutions = await this.getExecutionsByWorkflowId(
        workflowId,
        nextCursor
      );
      return [...data, ...nextExecutions];
    }

    return data;
  }

  async getLastExecutionByWorkflowId(
    workflowId: string
  ): Promise<Execution | null> {
    const executions = await this.getExecutionsByWorkflowId(workflowId);

    return (
      executions.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )[0] ?? null
    );
  }
}
