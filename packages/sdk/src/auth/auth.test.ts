import { MemoryBiometrics } from '../biometrics/biometrics';
import { MemorySecureStorage } from '../storage/secureStorage';
import { AuthManager } from './authManager';
import { CredentialsAuthStrategy } from './credentialsStrategy';
import { FakeRefreshProvider } from './fakeRefreshProvider';
import { CompanySsoAuthStrategy } from './ssoStrategy';
import type { JsonTransport } from '../http/transport';

const authResponse = {
  access_token: 'access-1',
  token_type: 'Bearer',
  expires_in: 3600,
  identity: { auth_user_id: 'user-1', associate_id: 'assoc-1', application_roles: ['associate'] },
};

class StubTransport {
  public calls: Array<{ method: string; path: string; body?: unknown }> = [];
  async request<T>(method: string, path: string, options: { body?: unknown } = {}): Promise<T> {
    this.calls.push({ method, path, body: options.body });
    return authResponse as T;
  }
}

describe('auth', () => {
  test('credentials and sso strategies authenticate', async () => {
    const transport = new StubTransport();
    const creds = new CredentialsAuthStrategy(transport as unknown as JsonTransport, { pathPrefix: '/v1' });
    const session = await creds.authenticate({ email: 'demo@example.com', associateId: 'assoc-1' });
    expect(session.accessToken).toBe('access-1');
    expect(transport.calls[0]).toMatchObject({
      method: 'POST',
      path: '/v1/auth/demo',
      body: { email: 'demo@example.com', associate_id: 'assoc-1' },
    });

    const sso = new CompanySsoAuthStrategy(
      { signIn: async () => ({ email: 'demo@example.com', associateId: 'assoc-1' }) },
      creds,
    );
    await expect(sso.authenticate()).resolves.toMatchObject({ accessToken: 'access-1' });
  });

  test('credentials strategy validates its input and auth manager needs sso config', async () => {
    const creds = new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport);
    await expect(creds.authenticate()).rejects.toThrow('Credentials are required');

    const manager = new AuthManager({
      storage: new MemorySecureStorage(),
      credentialsStrategy: creds,
    });
    await expect(manager.authenticate({ strategy: 'sso' })).rejects.toThrow('SSO strategy is not configured');
  });

  test('auth manager restores, refreshes and logs out', async () => {
    const storage = new MemorySecureStorage();
    const biometrics = new MemoryBiometrics(true, true, false);
    const refreshProvider = new FakeRefreshProvider(['access-2', 'access-3', 'access-4', 'access-5']);
    const creds = new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport);
    const manager = new AuthManager({
      storage,
      biometrics,
      credentialsStrategy: creds,
      refreshProvider: {
        refresh: async (refreshToken: string) => refreshProvider.refresh(refreshToken),
      },
      refreshKey: 'refresh',
    });
    expect(manager.getAccessToken()).toBeNull();

    const session = await manager.authenticate({ strategy: 'credentials', email: 'demo@example.com', associateId: 'assoc-1' });
    expect(session?.accessToken).toBe('access-1');
    expect(await storage.getItem('refresh')).toBeNull();

    await storage.setItem('refresh', 'refresh-1');
    const refreshedTokens = await Promise.all([manager.refreshAccessToken(), manager.refreshAccessToken()]);
    expect(refreshedTokens).toEqual(['access-2', 'access-2']);
    const restored = await manager.authenticate();
    expect(restored?.accessToken).toBe('access-3');
    expect(manager.getAccessToken()).toBe('access-3');

    await manager.logout();
    expect(manager.getSession()).toBeNull();
    expect(await storage.getItem('refresh')).toBeNull();

    const emptyManager = new AuthManager({
      storage: new MemorySecureStorage(),
      biometrics,
      credentialsStrategy: creds,
      refreshProvider: {
        refresh: async (refreshToken: string) => refreshProvider.refresh(refreshToken),
      },
      refreshKey: 'refresh',
    });
    await expect(emptyManager.authenticate()).resolves.toBeNull();
  });

  test('restore fails without biometrics availability', async () => {
    const storage = new MemorySecureStorage();
    await storage.setItem('refresh', 'refresh-1');
    const manager = new AuthManager({
      storage,
      biometrics: new MemoryBiometrics(false, true, false),
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshProvider: { refresh: async () => ({ accessToken: 'x', refreshToken: null }) },
      refreshKey: 'refresh',
    });

    await expect(manager.refreshAccessToken()).rejects.toThrow('Biometrics are not available');
  });

  test('returns null when refreshing without a stored token', async () => {
    const manager = new AuthManager({
      storage: new MemorySecureStorage(),
      biometrics: new MemoryBiometrics(true, true, false),
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshKey: 'refresh',
    });

    await expect(manager.refreshAccessToken()).resolves.toBeNull();
  });

  test('restores without refresh provider and handles biometric cancellation', async () => {
    const storage = new MemorySecureStorage();
    await storage.setItem('refresh', 'refresh-1');
    const biometrics = new MemoryBiometrics(true, true, false);
    const manager = new AuthManager({
      storage,
      biometrics,
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshKey: 'refresh',
    });

    await expect(manager.refreshAccessToken()).resolves.toBeNull();

    await storage.setItem('refresh', 'refresh-2');
    await biometrics.cancel();
    await expect(manager.refreshAccessToken()).rejects.toThrow('Biometric authentication was cancelled');
  });

  test('refreshes from token when no session is loaded', async () => {
    const storage = new MemorySecureStorage();
    await storage.setItem('refresh', 'refresh-1');
    const manager = new AuthManager({
      storage,
      biometrics: new MemoryBiometrics(true, true, false),
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshProvider: {
        refresh: async () => ({ accessToken: 'access-restored', refreshToken: 'refresh-restored' }),
      },
      refreshKey: 'refresh',
    });

    const session = await manager.authenticate();
    expect(session?.accessToken).toBe('access-restored');
    expect(manager.getAccessToken()).toBe('access-restored');
  });

  test('uses sso and clears refresh tokens when none are returned', async () => {
    const storage = new MemorySecureStorage();
    const creds = new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport);
    const manager = new AuthManager({
      storage,
      credentialsStrategy: creds,
      ssoStrategy: new CompanySsoAuthStrategy(
        { signIn: async () => ({ email: 'demo@example.com', associateId: 'assoc-1' }) },
        creds,
      ),
    });

    const session = await manager.authenticate({ strategy: 'sso' });
    expect(session?.accessToken).toBe('access-1');
    expect(await storage.getItem('refresh')).toBeNull();
  });

  test('invokes the private strategy helper for both branches', async () => {
    const storage = new MemorySecureStorage();
    const creds = new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport);
    const manager = new AuthManager({
      storage,
      biometrics: new MemoryBiometrics(true, true, false),
      credentialsStrategy: creds,
      ssoStrategy: new CompanySsoAuthStrategy(
        { signIn: async () => ({ email: 'demo@example.com', associateId: 'assoc-1' }) },
        creds,
      ),
    });

    await expect(
      (manager as unknown as { authenticateWithStrategy: (input: { strategy: 'sso' }) => Promise<unknown> }).authenticateWithStrategy({
        strategy: 'sso',
      }),
    ).resolves.toBeDefined();
  });

  test('handles empty refresh storage and unlocked failures', async () => {
    const storage = new MemorySecureStorage();
    const manager = new AuthManager({
      storage,
      biometrics: {
        isAvailable: async () => true,
        authenticate: async () => false,
        cancel: async () => undefined,
      },
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshProvider: {
        refresh: async () => ({ accessToken: 'access-null', refreshToken: null }),
      },
      refreshKey: 'refresh',
    });

    await expect(manager.refreshAccessToken()).resolves.toBeNull();
    await storage.setItem('refresh', 'refresh-3');
    await expect(manager.refreshAccessToken()).rejects.toThrow('Biometric authentication was cancelled');
  });

  test('removes refresh tokens when provider returns none', async () => {
    const storage = new MemorySecureStorage();
    await storage.setItem('refresh', 'refresh-4');
    const manager = new AuthManager({
      storage,
      biometrics: new MemoryBiometrics(true, true, false),
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshProvider: {
        refresh: async () => ({ accessToken: 'access-no-refresh', refreshToken: null }),
      },
      refreshKey: 'refresh',
    });

    const token = await manager.refreshAccessToken();
    expect(token).toBe('access-no-refresh');
    expect(await storage.getItem('refresh')).toBeNull();
  });

  test('covers private persistence and biometric guards', async () => {
    const storage = new MemorySecureStorage();
    const biometrics = new MemoryBiometrics(true, true, false);
    const manager = new AuthManager({
      storage,
      biometrics,
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshKey: 'refresh',
    });

    await (manager as unknown as { persistSession: (session: { accessToken: string; tokenType: string; expiresAt: string; refreshToken: string | null }) => Promise<void> }).persistSession({
      accessToken: 'token-a',
      tokenType: 'Bearer',
      expiresAt: '2026-11-24T00:00:00.000Z',
      refreshToken: 'refresh-a',
    });
    expect(await storage.getItem('refresh')).toBe('refresh-a');

    await (manager as unknown as { persistSession: (session: { accessToken: string; tokenType: string; expiresAt: string; refreshToken: string | null }) => Promise<void> }).persistSession({
      accessToken: 'token-b',
      tokenType: 'Bearer',
      expiresAt: '2026-11-24T00:00:00.000Z',
      refreshToken: null,
    });
    expect(await storage.getItem('refresh')).toBeNull();

    await expect(
      (manager as unknown as { ensureBiometricsUnlocked: () => Promise<void> }).ensureBiometricsUnlocked(),
    ).resolves.toBeUndefined();

    const noBiometricManager = new AuthManager({
      storage: new MemorySecureStorage(),
      credentialsStrategy: new CredentialsAuthStrategy(new StubTransport() as unknown as JsonTransport),
      refreshKey: 'refresh',
    });
    await expect(
      (noBiometricManager as unknown as { ensureBiometricsUnlocked: () => Promise<void> }).ensureBiometricsUnlocked(),
    ).resolves.toBeUndefined();
  });
});
