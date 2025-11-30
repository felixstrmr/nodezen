/**
 * Base error class for sync operations
 */
export class SyncError extends Error {
  constructor(
    message: string,
    public readonly instanceId: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "SyncError";
  }
}

/**
 * Error thrown when instance connection fails
 */
export class InstanceConnectionError extends SyncError {
  constructor(instanceId: string, cause?: unknown) {
    super(`Failed to connect to instance ${instanceId}`, instanceId, cause);
    this.name = "InstanceConnectionError";
  }
}

/**
 * Error thrown when sync operation fails
 */
export class SyncOperationError extends SyncError {
  constructor(
    message: string,
    instanceId: string,
    public readonly operation: string,
    cause?: unknown
  ) {
    super(message, instanceId, cause);
    this.name = "SyncOperationError";
  }
}
