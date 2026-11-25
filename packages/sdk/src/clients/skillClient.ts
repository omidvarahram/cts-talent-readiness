import type { JsonTransport } from '../http/transport';
import type { Learning, Page, SkillCatalogueItem } from '../types/domain';
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

export class SkillClient {
  constructor(private readonly transport: JsonTransport) {}

  listSkills(options: ListOptions = {}): Promise<Page<SkillCatalogueItem>> {
    return this.transport.request('GET', addQuery('/v1/skills', options));
  }

  listLearnings(options: ListOptions = {}): Promise<Page<Learning>> {
    return this.transport.request('GET', addQuery('/v1/learnings', options));
  }

  getLearning(learningCode: string): Promise<Learning> {
    return this.transport.request('GET', `/v1/learnings/${learningCode}`);
  }
}
