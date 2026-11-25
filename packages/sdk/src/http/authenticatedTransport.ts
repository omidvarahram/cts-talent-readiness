import { ApiError } from '../errors';
import type { JsonTransport, TransportRequestOptions } from './transport';

export interface TokenProvider {
  getAccessToken(): string | null | Promise<string | null>;
}

export interface RefreshCoordinator {
  refreshAccessToken(): Promise<string | null | undefined>;
}

export class AuthenticatedTransport {
  private refreshPromise: Promise<string | null | undefined> | null = null;

  constructor(
    private readonly transport: JsonTransport,
    private readonly tokenProvider: TokenProvider,
    private readonly refreshCoordinator: RefreshCoordinator,
  ) {}

  async request<T>(method: string, path: string, options: TransportRequestOptions = {}): Promise<T> {
    return this.requestWithRetry<T>(method, path, options, false, null);
  }

  private async requestWithRetry<T>(
    method: string,
    path: string,
    options: TransportRequestOptions,
    retried: boolean,
    overrideToken: string | null,
  ): Promise<T> {
    const accessToken = overrideToken ?? (await this.tokenProvider.getAccessToken());
    const headers = accessToken ? { ...(options.headers ?? {}), Authorization: `Bearer ${accessToken}` } : options.headers;

    try {
      return await this.transport.request<T>(method, path, { ...options, headers });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401 && !retried) {
        const token = await this.refreshOnce();
        if (!token) {
          throw error;
        }
        return this.requestWithRetry<T>(method, path, options, true, token);
      }
      throw error;
    }
  }

  private async refreshOnce(): Promise<string | null | undefined> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshCoordinator.refreshAccessToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }
}
