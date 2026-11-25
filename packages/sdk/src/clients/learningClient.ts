import type { JsonTransport } from '../http/transport';
import type { LearningAssignment, Page } from '../types/domain';
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

export class LearningClient {
  constructor(private readonly transport: JsonTransport) {}

  listMyAssignments(options: ListOptions = {}): Promise<Page<LearningAssignment>> {
    return this.transport.request('GET', addQuery('/v1/me/assignments', options));
  }

  listAssignments(options: ListOptions = {}): Promise<Page<LearningAssignment>> {
    return this.transport.request('GET', addQuery('/v1/assignments', options));
  }

  getAssignment(assignmentId: string): Promise<LearningAssignment> {
    return this.transport.request('GET', `/v1/assignments/${assignmentId}`);
  }
}
