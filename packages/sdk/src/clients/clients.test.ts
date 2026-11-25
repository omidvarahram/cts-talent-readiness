import { AdminClient } from './adminClient';
import { AssociateClient } from './associateClient';
import { LearningClient } from './learningClient';
import { SkillClient } from './skillClient';
import { TeamClient } from './teamClient';
import type { JsonTransport } from '../http/transport';

class StubTransport {
  public calls: Array<{ method: string; path: string }> = [];
  constructor(private readonly response: unknown) {}
  async request<T>(method: string, path: string): Promise<T> {
    this.calls.push({ method, path });
    return this.response as T;
  }
}

describe('clients', () => {
  test('call the expected endpoints', async () => {
    const transport = new StubTransport({ items: [], total: 0, limit: 20, offset: 0, next_offset: null });
    const associate = new AssociateClient(transport as unknown as JsonTransport);
    const skills = new SkillClient(transport as unknown as JsonTransport);
    const learning = new LearningClient(transport as unknown as JsonTransport);
    const team = new TeamClient(transport as unknown as JsonTransport);
    const admin = new AdminClient(transport as unknown as JsonTransport);

    await associate.getMe();
    await associate.getProfile('6100001');
    await associate.getMeProfile();
    await associate.listMeSkills();
    await associate.listMeAssignments();
    await associate.listAssociates();
    await associate.listAssociates({ limit: 10, q: 'alex' });
    await associate.listMeSkills({ limit: 1, offset: 2, q: 'me' });
    await associate.listMeAssignments({ limit: 1, offset: 2, q: 'me' });
    await associate.listAssociateSkills('6100001', { limit: 1, offset: 2, q: 'skill' });
    await associate.listAssociateSkills('6100001');
    await associate.listAssociateAssignments('6100001', { limit: 1, offset: 2, q: 'assign' });
    await associate.listAssociateAssignments('6100001');
    await skills.listSkills();
    await skills.listSkills({ offset: 20 });
    await skills.listSkills({ limit: 2, offset: 4, q: 'java' });
    await skills.listLearnings();
    await skills.listLearnings({ limit: 3, offset: 1, q: 'learn' });
    await skills.getLearning('LEARN-1');
    await learning.listMyAssignments();
    await learning.listMyAssignments({ limit: 1, offset: 3, q: 'mine' });
    await learning.listAssignments();
    await learning.listAssignments({ limit: 5 });
    await learning.listAssignments({ limit: 2, offset: 1, q: 'all' });
    await learning.getAssignment('assignment-1');
    await team.getTeam();
    await team.getTeam({ limit: 2, offset: 1, q: 'team' });
    await admin.listUsers();
    await admin.listUsers({ limit: 2, offset: 1, q: 'admin' });

    expect(transport.calls).toHaveLength(29);
    expect(transport.calls[0]?.path).toBe('/v1/me');
    expect(transport.calls[1]?.path).toBe('/v1/associates/6100001');
    expect(transport.calls[2]?.path).toBe('/v1/me/profile');
    expect(transport.calls[3]?.path).toBe('/v1/me/skills');
    expect(transport.calls[4]?.path).toBe('/v1/me/assignments');
    expect(transport.calls[5]?.path).toBe('/v1/associates');
    expect(transport.calls.some((call) => call.path === '/v1/skills?limit=2&offset=4&q=java')).toBe(true);
    expect(transport.calls.some((call) => call.path === '/v1/learnings?limit=3&offset=1&q=learn')).toBe(true);
    expect(transport.calls.some((call) => call.path === '/v1/team?limit=2&offset=1&q=team')).toBe(true);
    expect(transport.calls.some((call) => call.path === '/v1/admin/users?limit=2&offset=1&q=admin')).toBe(true);
  });
});
