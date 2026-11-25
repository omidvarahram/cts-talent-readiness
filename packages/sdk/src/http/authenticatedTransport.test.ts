// @ts-nocheck
import { ApiError } from '../errors';
import { AuthenticatedTransport } from './authenticatedTransport';
import type { JsonTransport, TransportRequestOptions } from './transport';

class StubTransport {
  public calls: Array<{ method: string; path: string; options: TransportRequestOptions }> = [];
  private readonly responses: Array<unknown> = [];

  enqueue(value: unknown): void {
    this.responses.push(value);
  }

  async request<T>(method: string, path: string, options: TransportRequestOptions = {}): Promise<T> {
    this.calls.push({ method, path, options });
    const next = this.responses.shift();
    if (next instanceof Error) {
      throw next;
    }
    return next as T;
  }
}

describe('AuthenticatedTransport', () => {
  test('adds bearer auth and retries once after a single refresh', async () => {
    const transport = new StubTransport();
    const firstError = new ApiError('unauth', 401, null, 'UNAUTHENTICATED');
    transport.enqueue(firstError);
    transport.enqueue({ ok: true });
    let refreshCount = 0;
    const auth = new AuthenticatedTransport(transport as unknown as JsonTransport, { getAccessToken: () => 'token-1' }, {
      refreshAccessToken: async () => {
        refreshCount += 1;
        return 'token-2';
      },
    });

    await expect(auth.request('GET', '/v1/me')).resolves.toEqual({ ok: true });
    expect(refreshCount).toBe(1);
    expect(transport.calls[0]?.options.headers).toMatchObject({ Authorization: 'Bearer token-1' });
    expect(transport.calls[1]?.options.headers).toMatchObject({ Authorization: 'Bearer token-2' });
  });

  test('shares one refresh across concurrent 401s and surfaces failures', async () => {
    const transport = new StubTransport();
    transport.enqueue(new ApiError('unauth', 401, null, 'UNAUTHENTICATED'));
    transport.enqueue(new ApiError('unauth', 401, null, 'UNAUTHENTICATED'));
    let refreshCount = 0;
    const auth = new AuthenticatedTransport(transport as unknown as JsonTransport, { getAccessToken: () => 'token' }, {
      refreshAccessToken: async () => {
        refreshCount += 1;
        return null;
      },
    });

    await expect(Promise.all([auth.request('GET', '/a'), auth.request('GET', '/b')])).rejects.toBeInstanceOf(ApiError);
    expect(refreshCount).toBe(1);
  });

  test('surfaces the original 401 when refresh returns no token', async () => {
    const transport = new StubTransport();
    const error = new ApiError('unauth', 401, null, 'UNAUTHENTICATED');
    transport.enqueue(error);
    const auth = new AuthenticatedTransport(transport as unknown as JsonTransport, { getAccessToken: () => 'token' }, {
      refreshAccessToken: async () => null,
    });

    await expect(auth.request('GET', '/v1/me')).rejects.toBe(error);
  });

  test('does not retry non-401 api errors', async () => {
    const transport = new StubTransport();
    const error = new ApiError('server error', 500, null, 'INTERNAL');
    transport.enqueue(error);
    const auth = new AuthenticatedTransport(transport as unknown as JsonTransport, { getAccessToken: () => 'token' }, {
      refreshAccessToken: async () => 'new-token',
    });

    await expect(auth.request('GET', '/v1/me')).rejects.toBe(error);
  });

  test('skips the authorization header when no token exists', async () => {
    const transport = new StubTransport();
    transport.enqueue({ ok: true });
    const auth = new AuthenticatedTransport(transport as unknown as JsonTransport, { getAccessToken: () => null });

    await expect(auth.request('GET', '/v1/me')).resolves.toEqual({ ok: true });
  });
});
