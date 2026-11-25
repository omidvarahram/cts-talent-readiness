import { ConflictError } from '../errors';
import type {
  AddSkillInput,
  AssignLearningInput,
  DecideApprovalInput,
  PatchProgressInput,
  PatchProfileInput,
  PatchRolesInput,
  PatchSkillInput,
  RegisterFileInput,
  SessionMutationRepository,
} from '../session/mutationRepository';

export type QueueOperation =
  | 'patchProfile'
  | 'addSkill'
  | 'patchSkill'
  | 'patchProgress'
  | 'decideApproval'
  | 'assignLearning'
  | 'patchRoles'
  | 'registerFile';

export interface QueuedMutation<TPayload = unknown> {
  id: string;
  accountId: string;
  operation: QueueOperation;
  payload: TPayload;
  expectedVersion?: number;
  idempotencyKey: string;
  attempts: number;
  state: 'pending' | 'conflict' | 'applied';
  createdAt: string;
  lastError?: string;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export class MutationQueue {
  private readonly items: QueuedMutation[] = [];
  private counter = 1;

  constructor(private readonly repository: SessionMutationRepository) {}

  enqueue<TPayload>(
    accountId: string,
    operation: QueueOperation,
    payload: TPayload,
    options: { expectedVersion?: number; idempotencyKey?: string } = {},
  ): QueuedMutation<TPayload> {
    const item: QueuedMutation<TPayload> = {
      id: `queue-${this.counter++}`,
      accountId,
      operation,
      payload: clone(payload),
      expectedVersion: options.expectedVersion,
      idempotencyKey: options.idempotencyKey ?? `queue-${this.counter}`,
      attempts: 0,
      state: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.items.push(item);
    return clone(item);
  }

  snapshot(accountId?: string): QueuedMutation[] {
    return clone(accountId ? this.items.filter((item) => item.accountId === accountId) : this.items);
  }

  purgeForAccount(accountId: string): void {
    this.items.splice(0, this.items.length, ...this.items.filter((item) => item.accountId !== accountId));
  }

  purgeAll(): void {
    this.items.length = 0;
  }

  async replay(accountId: string): Promise<QueuedMutation[]> {
    const replayed: QueuedMutation[] = [];
    for (const item of [...this.items]) {
      if (item.accountId !== accountId || item.state !== 'pending') {
        continue;
      }
      item.attempts += 1;
      try {
        this.dispatch(item);
        item.state = 'applied';
        replayed.push(clone(item));
        this.items.splice(this.items.indexOf(item), 1);
      } catch (error) {
        if (error instanceof ConflictError) {
          item.state = 'conflict';
          item.lastError = error.message;
          replayed.push(clone(item));
          continue;
        }
        item.lastError = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    }
    return replayed;
  }

  markConflict(id: string, message: string): void {
    const item = this.items.find((entry) => entry.id === id);
    if (!item) {
      return;
    }
    item.state = 'conflict';
    item.lastError = message;
  }

  private dispatch(item: QueuedMutation): unknown {
    switch (item.operation) {
      case 'patchProfile':
        return this.repository.patchProfile({ ...(item.payload as PatchProfileInput), expected_version: item.expectedVersion ?? (item.payload as PatchProfileInput).expected_version });
      case 'addSkill':
        return this.repository.addSkill(item.payload as AddSkillInput);
      case 'patchSkill':
        return this.repository.patchSkill({ ...(item.payload as PatchSkillInput), expected_version: item.expectedVersion ?? (item.payload as PatchSkillInput).expected_version });
      case 'patchProgress':
        return this.repository.patchProgress({ ...(item.payload as PatchProgressInput), expected_version: item.expectedVersion ?? (item.payload as PatchProgressInput).expected_version });
      case 'decideApproval':
        return this.repository.decideApproval({ ...(item.payload as DecideApprovalInput), expected_version: item.expectedVersion ?? (item.payload as DecideApprovalInput).expected_version });
      case 'assignLearning':
        return this.repository.assignLearning(item.payload as AssignLearningInput);
      case 'patchRoles':
        return this.repository.patchRoles({ ...(item.payload as PatchRolesInput), expected_version: item.expectedVersion ?? (item.payload as PatchRolesInput).expected_version });
      case 'registerFile':
        return this.repository.registerFile(item.payload as RegisterFileInput);
      default:
        throw new ConflictError(`Unsupported operation ${(item as { operation: string }).operation}`);
    }
  }
}
