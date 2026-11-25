// @ts-nocheck
import { ApiError, TimeoutError, TransportError, toApiError } from '../errors';
import { parseApiErrorEnvelope } from '../validation';

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface TransportRequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export class JsonTransport {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: FetchLike,
    private readonly defaultTimeoutMs = 15000,
  ) {}

  async request<T>(method: string, path: string, options: TransportRequestOptions = {}): Promise<T> {
    const url = new URL(path, this.baseUrl);
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort('timeout'), timeoutMs);
    }
    const linkAbort = () => controller.abort(options.signal?.reason ?? 'aborted');

    if (options.signal) {
      if (options.signal.aborted) {
        throw new TransportError('Request aborted', { code: 'ABORTED', cause: options.signal.reason });
      }
      options.signal.addEventListener('abort', linkAbort, { once: true });
    }

    try {
      const response = await this.fetchImpl(url, {
        method,
        headers: {
          Accept: 'application/json',
          ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(options.headers ?? {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (controller.signal.aborted) {
        throw new TimeoutError();
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new TransportError('Network request failed', { cause: error });
    } finally {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (options.signal) {
        options.signal.removeEventListener('abort', linkAbort);
      }
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const requestId = response.headers.get('x-request-id');
    if (!response.ok) {
      const body = await this.tryReadJson(response);
      throw toApiError(
        response.status,
        parseApiErrorEnvelope(body),
        requestId,
        `HTTP ${response.status}`,
        { body },
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const body = await this.tryReadJson(response);
    return body as T;
  }

  private async tryReadJson(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new TransportError('Expected JSON response', { cause: error });
    }
  }
}
