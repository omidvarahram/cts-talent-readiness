import { ValidationError } from '../errors';
import { parseAuthResponse } from '../validation';
import type { JsonTransport } from '../http/transport';
import { AuthStrategy } from './strategy';
import type { AuthSession } from '../types/domain';

export interface CredentialsAuthInput {
  email: string;
  associateId: string;
}

export interface CredentialsAuthStrategyOptions {
  pathPrefix?: string;
}

export class CredentialsAuthStrategy extends AuthStrategy<CredentialsAuthInput> {
  readonly kind = 'credentials';

  constructor(
    private readonly transport: JsonTransport,
    private readonly options: CredentialsAuthStrategyOptions = {},
  ) {
    super();
  }

  async authenticate(input?: CredentialsAuthInput): Promise<AuthSession> {
    if (!input?.email || !input?.associateId) {
      throw new ValidationError('Credentials are required');
    }
    const pathPrefix = this.options.pathPrefix ?? '/v1';
    const response = await this.transport.request<unknown>('POST', `${pathPrefix}/auth/demo`, {
      body: { email: input.email, associate_id: input.associateId },
    });
    const parsed = parseAuthResponse(response);
    return {
      accessToken: parsed.access_token,
      tokenType: parsed.token_type,
      expiresAt: new Date(Date.now() + parsed.expires_in * 1000).toISOString(),
      identity: parsed.identity,
      refreshToken: null,
    };
  }
}
