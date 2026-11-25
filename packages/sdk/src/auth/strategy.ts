import type { AuthSession } from '../types/domain';

export abstract class AuthStrategy<TInput = unknown> {
  abstract readonly kind: string;

  abstract authenticate(input?: TInput): Promise<AuthSession>;
}
