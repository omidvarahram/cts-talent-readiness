import type { JsonTransport } from '../http/transport';
import type { Associate, AssociateSkill, LearningAssignment, Page, Profile } from '../types/domain';

export interface ListOptions {
  limit?: number;
  offset?: number;
  q?: string;
}

/* istanbul ignore next */
const addQuery = (path: string, options: ListOptions = {}): string => {
  const params = new URLSearchParams();
  if (options.limit !== undefined) params.set('limit', String(options.limit));
  if (options.offset !== undefined) params.set('offset', String(options.offset));
  if (options.q) params.set('q', options.q);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export class AssociateClient {
  constructor(private readonly transport: JsonTransport) {}

  getMe(): Promise<Associate> {
    return this.transport.request('GET', '/v1/me');
  }

  getProfile(associateId: string): Promise<Associate> {
    return this.transport.request('GET', `/v1/associates/${associateId}`);
  }

  getMeProfile(): Promise<Associate> {
    return this.transport.request('GET', '/v1/me/profile');
  }

  listMeSkills(options: ListOptions = {}): Promise<Page<AssociateSkill>> {
    return this.transport.request('GET', addQuery('/v1/me/skills', options));
  }

  listMeAssignments(options: ListOptions = {}): Promise<Page<LearningAssignment>> {
    return this.transport.request('GET', addQuery('/v1/me/assignments', options));
  }

  listAssociates(options: ListOptions = {}): Promise<Page<Associate>> {
    return this.transport.request('GET', addQuery('/v1/associates', options));
  }

  listAssociateSkills(associateId: string, options: ListOptions = {}): Promise<Page<AssociateSkill>> {
    return this.transport.request('GET', addQuery(`/v1/associates/${associateId}/skills`, options));
  }

  listAssociateAssignments(associateId: string, options: ListOptions = {}): Promise<Page<LearningAssignment>> {
    return this.transport.request('GET', addQuery(`/v1/associates/${associateId}/assignments`, options));
  }
}
