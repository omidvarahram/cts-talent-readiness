import { ValidationError } from '../errors';
import { CredentialsAuthStrategy } from './credentialsStrategy';

describe('CredentialsAuthStrategy', () => {
  test('posts demo login requests with a custom prefix', async () => {
    const calls: Array<{ method: string; path: string; body: unknown }> = [];
    const transport = {
      request: async (method: string, path: string, init?: { body?: unknown }) => {
        calls.push({ method, path, body: init?.body });
        return {
          access_token: 'access-1',
          refresh_token: 'refresh-1',
          token_type: 'Bearer',
          expires_in: 3600,
          identity: {
            auth_user_id: 'user-1',
            associate_id: '6100001',
            application_roles: ['associate'],
            email: 'demo@example.com',
            display_name: 'Demo',
            manager_associate_id: '7777777',
            role: 'associate',
            team: 'Talent',
          },
        };
      },
    };

    const strategy = new CredentialsAuthStrategy(transport as never, { pathPrefix: '/custom' });
    await expect(
      strategy.authenticate({ email: 'demo@example.com', associateId: '6100001' }),
    ).resolves.toMatchObject({ accessToken: 'access-1', refreshToken: null });
    expect(calls).toEqual([
      {
        method: 'POST',
        path: '/custom/auth/demo',
        body: { email: 'demo@example.com', associate_id: '6100001' },
      },
    ]);
  });

  test('rejects missing credentials', async () => {
    const strategy = new CredentialsAuthStrategy({
      request: async () => {
        throw new Error('should not be called');
      },
    } as never);

    await expect(strategy.authenticate({ email: '', associateId: ' ' })).rejects.toBeInstanceOf(ValidationError);
  });
});
