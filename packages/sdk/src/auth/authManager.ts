import { BiometricsCancelledError, BiometricsLockoutError, type Biometrics } from '../biometrics/biometrics';
import { ValidationError } from '../errors';
import type { SecureStorage } from '../storage/secureStorage';
import type { AuthSession } from '../types/domain';
import type { CredentialsAuthInput } from './credentialsStrategy';
import { CredentialsAuthStrategy } from './credentialsStrategy';
import { CompanySsoAuthStrategy, type DemoPortalAdapter } from './ssoStrategy';

export interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string | null;
}

export interface RefreshSessionProvider {
  refresh(refreshToken: string): Promise<RefreshSessionResult>;
}

export type AuthManagerInput =
  | { strategy: 'credentials'; email: string; associateId: string }
  | { strategy: 'sso' };

export interface AuthManagerOptions {
  storage: SecureStorage;
  biometrics?: Biometrics;
  credentialsStrategy: CredentialsAuthStrategy;
  ssoStrategy?: CompanySsoAuthStrategy;
  refreshProvider?: RefreshSessionProvider;
  refreshKey?: string;
}

const DEFAULT_REFRESH_KEY = 'cts-talent.refresh-token';

export class AuthManager {
  private currentSession: AuthSession | null = null;
  private refreshPromise: Promise<AuthSession | null> | null = null;

  constructor(private readonly options: AuthManagerOptions) {}

  async authenticate(input?: AuthManagerInput): Promise<AuthSession | null> {
    if (!input) {
      return this.restoreSession();
    }
    const session = await this.authenticateWithStrategy(input);
    await this.persistSession(session);
    return session;
  }

  async refreshAccessToken(): Promise<string | null> {
    const session = await this.refreshSession();
    return session?.accessToken ?? null;
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    await this.options.storage.removeItem(this.refreshKey());
  }

  getSession(): AuthSession | null {
    return this.currentSession;
  }

  getAccessToken(): string | null {
    return this.currentSession?.accessToken ?? null;
  }

  private async authenticateWithStrategy(input: AuthManagerInput): Promise<AuthSession> {
    if (input.strategy === 'credentials') {
      const payload: CredentialsAuthInput = { email: input.email, associateId: input.associateId };
      return this.options.credentialsStrategy.authenticate(payload);
    }
    if (!this.options.ssoStrategy) {
      throw new ValidationError('SSO strategy is not configured');
    }
    return this.options.ssoStrategy.authenticate();
  }

  private async restoreSession(): Promise<AuthSession | null> {
    const refreshToken = await this.options.storage.getItem(this.refreshKey());
    if (!refreshToken) {
      return null;
    }
    await this.ensureBiometricsUnlocked();
    return this.refreshFromToken(refreshToken);
  }

  private async refreshSession(): Promise<AuthSession | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.restoreOrRefresh().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async restoreOrRefresh(): Promise<AuthSession | null> {
    const refreshToken = await this.options.storage.getItem(this.refreshKey());
    if (!refreshToken) {
      return null;
    }
    await this.ensureBiometricsUnlocked();
    if (!this.options.refreshProvider) {
      return this.currentSession;
    }
    return this.refreshFromToken(refreshToken);
  }

  private async refreshFromToken(refreshToken: string): Promise<AuthSession> {
    const refreshed = await this.options.refreshProvider!.refresh(refreshToken);
    const session = this.toSession(this.currentSession ?? this.buildSessionSkeleton(), refreshed.accessToken, refreshed.refreshToken);
    this.currentSession = session;
    if (refreshed.refreshToken) {
      await this.options.storage.setItem(this.refreshKey(), refreshed.refreshToken);
    } else {
      await this.options.storage.removeItem(this.refreshKey());
    }
    return session;
  }

  private buildSessionSkeleton(): AuthSession {
    return {
      accessToken: '',
      tokenType: 'Bearer',
      expiresAt: new Date().toISOString(),
      identity: {
        auth_user_id: '',
        associate_id: '',
        application_roles: [],
      },
      refreshToken: null,
    };
  }

  private toSession(base: AuthSession, accessToken: string, refreshToken: string | null): AuthSession {
    return {
      ...base,
      accessToken,
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      refreshToken,
    };
  }

  private async persistSession(session: AuthSession): Promise<void> {
    this.currentSession = session;
    if (session.refreshToken) {
      await this.options.storage.setItem(this.refreshKey(), session.refreshToken);
    } else {
      await this.options.storage.removeItem(this.refreshKey());
    }
  }

  private async ensureBiometricsUnlocked(): Promise<void> {
    if (!this.options.biometrics) {
      return;
    }
    const available = await this.options.biometrics.isAvailable();
    if (!available) {
      throw new ValidationError('Biometrics are not available');
    }
    const unlocked = await this.options.biometrics.authenticate('Unlock session');
    if (!unlocked) {
      throw new BiometricsCancelledError();
    }
  }

  private refreshKey(): string {
    return this.options.refreshKey ?? DEFAULT_REFRESH_KEY;
  }
}
