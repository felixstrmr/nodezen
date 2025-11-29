export type ExecutionMode =
  | "manual"
  | "trigger"
  | "internal"
  | "error"
  | "retry"
  | "webhook"
  | "cli";
export type ExecutionStatus =
  | "error"
  | "success"
  | "waiting"
  | "running"
  | "canceled";
export type WorkflowStatus = "active" | "inactive";
export type AuditCategory =
  | "credentials"
  | "database"
  | "nodes"
  | "filesystem"
  | "instance";

export type N8nError = {
  code?: string;
  message: string;
  description?: string;
};

export type Role = {
  readonly id: number;
  readonly name: string;
  readonly scope: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  disabled?: boolean;
  createdAt: string;
  updatedAt: string;
  settings?: Record<string, unknown>;
  isPending?: boolean;
};

export type UserList = {
  data: User[];
  nextCursor?: string | null;
};

export type InviteUsersRequest = {
  invites: Array<{
    email: string;
    role?: "member" | "admin";
  }>;
};

export type WorkflowSettings = {
  executionOrder?: "v0" | "v1";
  saveDataErrorExecution?: "all" | "none";
  saveDataSuccessExecution?: "all" | "none";
  saveManualExecutions?: boolean;
  callerPolicy?: string;
  errorWorkflow?: string;
  timezone?: string;
  saveExecutionProgress?: boolean;
  executionTimeout?: number;
};

export type Node = {
  id?: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  disabled?: boolean;
  notesInFlow?: boolean;
  notes?: string;
  parameters?: Record<string, unknown>;
  credentials?: Record<
    string,
    {
      id: string;
      name?: string;
    }
  >;
  webhookId?: string;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  onError?: "continueErrorOutput" | "continueRegularOutput" | "stopWorkflow";
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  continueOnFail?: boolean;
};

export type Tag = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Workflow = {
  id?: string;
  name: string;
  active: boolean;
  nodes: Node[];
  isArchived: boolean;
  connections: Record<
    string,
    Record<
      string,
      Array<{
        node: string;
        type: string;
        index: number;
      }>
    >
  >;
  settings?: WorkflowSettings;
  staticData?: Record<string, unknown> | null;
  tags?: Tag[];
  versionId?: string;
  meta?: {
    templateId?: string;
    instanceId?: string;
  };
  pinData?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  homeProject?: {
    id: string;
    name: string;
    type: string;
  };
};

export type WorkflowList = {
  data: Workflow[];
  nextCursor?: string | null;
};

export type WorkflowTransferRequest = {
  destinationProjectId: string;
};

export type WorkflowActivateRequest = {
  active: boolean;
};

export type ExecutionData = {
  startData?: {
    destinationNode?: string;
    runNodeFilter?: string[];
  };
  resultData?: {
    runData?: Record<
      string,
      Array<{
        startTime: number;
        executionTime: number;
        source?: Array<{
          previousNode: string;
          previousNodeOutput?: number;
          previousNodeRun?: number;
        }> | null;
        data?: {
          main?: Array<
            Array<{
              json: Record<string, unknown>;
              binary?: Record<
                string,
                {
                  data: string;
                  mimeType: string;
                  fileName?: string;
                  directory?: string;
                  fileSize?: string;
                  fileExtension?: string;
                }
              >;
              pairedItem?:
                | {
                    item: number;
                    input?: number;
                  }
                | Array<{
                    item: number;
                    input?: number;
                  }>;
            }>
          >;
        };
        error?: {
          message: string;
          stack?: string;
          name?: string;
          timestamp?: number;
          description?: string;
          context?: Record<string, unknown>;
          cause?: unknown;
        };
      }>
    >;
    lastNodeExecuted?: string;
    metadata?: Record<string, unknown>;
  };
  executionData?: {
    contextData?: Record<string, unknown>;
    nodeExecutionStack?: unknown[];
    metadata?: Record<string, unknown>;
    waitingExecution?: Record<string, unknown>;
    waitingExecutionSource?: Record<string, unknown>;
  };
};

export type Execution = {
  id: string;
  finished: boolean;
  mode: ExecutionMode;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId?: string;
  workflowName?: string;
  waitTill?: string | null;
  status?: ExecutionStatus;
  data?: ExecutionData;
  customData?: Record<string, string>;
  annotation?: {
    tags?: Array<{
      id: string;
      name: string;
    }>;
  };
};

export type ExecutionList = {
  data: Execution[];
  nextCursor?: string | null;
};

export type DeleteExecutionRequest = {
  deleteBefore?: string;
  filters?: {
    status?: ExecutionStatus[];
    workflowId?: string;
  };
  ids?: string[];
};

export type CredentialType = {
  readonly displayName: string;
  readonly name: string;
  readonly type: string;
  readonly default?: string;
};

export type Credential = {
  id?: string;
  name: string;
  type: string;
  data?: Record<string, unknown>;
  homeProject?: {
    id: string;
    name?: string;
    type?: string;
  };
  sharedWith?: Array<{
    id: string;
    type: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCredentialResponse = Credential & {
  id: string;
};

export type CredentialTransferRequest = {
  destinationProjectId: string;
};

export type AuditRisk = {
  severity: "warning" | "critical";
  messages: string[];
  sections?: string[];
};

export type Audit = {
  risk: {
    credentials?: AuditRisk;
    database?: AuditRisk;
    nodes?: AuditRisk;
    filesystem?: AuditRisk;
    instance?: AuditRisk;
  };
};

export type GenerateAuditRequest = {
  additionalOptions?: {
    daysAbandonedWorkflow?: number;
    categories?: AuditCategory[];
  };
};

export type PullOptions = {
  force?: boolean;
  variables?: Record<string, string>;
};

export type Pull = {
  statusCode: number;
  statusMessage: string;
  data?: {
    pulledFiles?: string[];
    variables?: Record<string, string>;
  };
};

export type ImportResult = {
  workflows?: Array<{
    id: string;
    name: string;
  }>;
  credentials?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  variables?: Array<{
    id: string;
    key: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
  }>;
};

export type GenerateDiffRequest = {
  target?: "local" | "remote";
  force?: boolean;
};

export type Variable = {
  id?: string;
  key: string;
  value?: string;
  type?: "string" | "boolean" | "number" | "json";
};

export type VariableList = {
  data: Variable[];
  nextCursor?: string | null;
};

export type Project = {
  id?: string;
  name: string;
  type: "team" | "personal";
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectList = {
  data: Project[];
  nextCursor?: string | null;
};

export type ListQueryParams = {
  limit?: number;
  cursor?: string;
};

export type ExecutionListQueryParams = ListQueryParams & {
  status?: ExecutionStatus;
  workflowId?: string;
  includeData?: boolean;
};

export type WorkflowListQueryParams = ListQueryParams & {
  active?: boolean;
  tags?: string;
  name?: string;
  projectId?: string;
};

export type UserListQueryParams = ListQueryParams & {
  includeRole?: boolean;
  limit?: number;
};

export type N8nClientConfig = {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
};

export type N8nApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: N8nError;
    };

export type WebhookTestRequest = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
};
