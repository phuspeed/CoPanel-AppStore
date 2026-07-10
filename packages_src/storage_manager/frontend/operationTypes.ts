/** GParted-style pending operation queue — mirrors backend PlannedOperation. */

export type PendingOpKind =
  | 'initialize'
  | 'create'
  | 'delete'
  | 'resize'
  | 'format'
  | 'label'
  | 'set_boot';

export interface PendingOperation {
  id: string;
  op: PendingOpKind;
  disk_name?: string;
  device?: string;
  confirm_token?: string;
  params: Record<string, unknown>;
  /** Human-readable summary for queue list */
  summary: string;
}

export interface OperationLogEntry {
  index: number;
  op: string;
  status: 'success' | 'failed' | 'pending';
  preview?: string;
  message: string;
}

export function newPendingId(): string {
  return `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function toApiPayload(op: PendingOperation) {
  return {
    op: op.op,
    disk_name: op.disk_name,
    device: op.device,
    confirm_token: op.confirm_token,
    params: op.params,
  };
}
