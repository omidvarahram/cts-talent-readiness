import { TransportError } from '../errors';
import { JsonTransport, type FetchLike, type TransportRequestOptions } from './transport';

export interface PinningTransport {
  request<T>(method: string, path: string, options?: TransportRequestOptions): Promise<T>;
}

export class InsecureDevTransport implements PinningTransport {
  private readonly transport: JsonTransport;

  constructor(baseUrl: string, fetchImpl: FetchLike, timeoutMs = 15000) {
    this.transport = new JsonTransport(baseUrl, fetchImpl, timeoutMs);
  }

  request<T>(method: string, path: string, options?: TransportRequestOptions): Promise<T> {
    return this.transport.request<T>(method, path, options);
  }
}

export interface FakePinnedTransportResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export class FakePinnedTransport implements PinningTransport {
  public readonly calls: Array<{ method: string; path: string }> = [];

  /* istanbul ignore next */
  constructor(
    private readonly allowedHosts: string[] = ['127.0.0.1', 'localhost'],
    private readonly responses: Record<string, FakePinnedTransportResponse> = {},
  ) {}

  async request<T>(method: string, path: string): Promise<T> {
    this.calls.push({ method, path });
    const url = new URL(path, 'http://127.0.0.1');
    if (!this.allowedHosts.includes(url.host)) {
      throw new TransportError(`Host not pinned: ${url.host}`, { code: 'PINNING_FAILED' });
    }
    const response = this.responses[`${method} ${url.pathname}`];
    if (!response) {
      throw new TransportError(`No fake response for ${method} ${url.pathname}`);
    }
    if (response.status >= 400) {
      throw new TransportError(`HTTP ${response.status}`, { code: `HTTP_${response.status}` });
    }
    return response.body as T;
  }
}
