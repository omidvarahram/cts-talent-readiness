import type { JsonTransport } from '../http/transport';
import type { AdminUser, Page } from '../types/domain';
import type { ListOptions } from './associateClient';

/* istanbul ignore next */
const addQuery = (path: string, options: ListOptions = {}): string => {
  const params = new URLSearchParams();
  if (options.limit !== undefined) params.set('limit', String(options.limit));
  if (options.offset !== undefined) params.set('offset', String(options.offset));
  if (options.q) params.set('q', options.q);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export class AdminClient {
  constructor(private readonly transport: JsonTransport) {}

  listUsers(options: ListOptions = {}): Promise<Page<AdminUser>> {
    return this.transport.request('GET', addQuery('/v1/admin/users', options));
  }
}
