export const PUBLIC_ROUTES = ["/", "/signin", "/signup"];

export const WORKSPACE_SUBSCRIPTION_TYPES = [
  {
    name: "free",
    executionFrequencyMinutes: 30,
    workflowFrequencyMinutes: 60,
    retentionDays: 30,
  },
  {
    name: "pro",
    executionFrequencyMinutes: 15,
    workflowFrequencyMinutes: 30,
    retentionDays: 90,
  },
  {
    name: "ultra",
    executionFrequencyMinutes: 5,
    workflowFrequencyMinutes: 15,
    retentionDays: 365,
  },
];

export const EXECUTION_STATUSES = [
  "error",
  "success",
  "waiting",
  "running",
  "canceled",
];

export const EXECUTION_MODES = [
  "trigger",
  "internal",
  "error",
  "retry",
  "webhook",
  "cli",
];
