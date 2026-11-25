import type { AuthSession } from '../types/domain';
import { AuthStrategy } from './strategy';
import { CredentialsAuthStrategy, type CredentialsAuthInput } from './credentialsStrategy';

export interface DemoPortalAdapter {
  signIn(): Promise<CredentialsAuthInput>;
}

export class CompanySsoAuthStrategy extends AuthStrategy<void> {
  readonly kind = 'company-sso';

  constructor(
    private readonly portalAdapter: DemoPortalAdapter,
    private readonly demoLogin: CredentialsAuthStrategy,
  ) {
    super();
  }

  async authenticate(): Promise<AuthSession> {
    const credentials = await this.portalAdapter.signIn();
    return this.demoLogin.authenticate(credentials);
  }
}
