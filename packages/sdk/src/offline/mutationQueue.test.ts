import { SessionMutationRepository } from '../session/mutationRepository';
import { MutationQueue } from './mutationQueue';

describe('MutationQueue', () => {
  test('replays queued mutations and purges by account', async () => {
    const repo = new SessionMutationRepository('reviewer-1');
    const queue = new MutationQueue(repo);

    const item = queue.enqueue(
      'account-1',
      'patchProfile',
      {
        associateId: '6100001',
        name: 'Queued',
        phone: '555-0102',
        address: '3 Talent Way',
        avatar_file_id: null,
        cv_file_id: null,
      },
      { expectedVersion: 1, idempotencyKey: 'queue-1' },
    );
    expect(queue.snapshot('account-1')).toHaveLength(1);

    const replayed = await queue.replay('account-1');
    expect(replayed[0]?.state).toBe('applied');
    expect(queue.snapshot('account-1')).toHaveLength(0);

    queue.enqueue(
      'account-1',
      'patchProfile',
      {
        associateId: '6100001',
        name: 'Stale',
        phone: '555-0103',
        address: '5 Talent Way',
        avatar_file_id: null,
        cv_file_id: null,
      },
      { expectedVersion: 1, idempotencyKey: 'queue-2' },
    );
    const conflicted = await queue.replay('account-1');
    expect(conflicted[0]?.state).toBe('conflict');
    expect(queue.snapshot('account-1')).toHaveLength(1);

    queue.enqueue('account-2', 'registerFile', {
      purpose: 'cv',
      name: 'cv.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1024,
    });
    queue.purgeForAccount('account-2');
    expect(queue.snapshot('account-1')).toHaveLength(1);
    queue.purgeForAccount('account-1');
    expect(queue.snapshot()).toHaveLength(0);

    queue.enqueue('account-3', 'patchProfile', {
      associateId: '6100001',
      name: 'Conflict',
      phone: '555-0103',
      address: '4 Talent Way',
      avatar_file_id: null,
      cv_file_id: null,
    });
    queue.markConflict(item.id, 'nope');
    queue.markConflict('missing', 'ignored');
    expect(queue.snapshot()).toHaveLength(1);
    queue.purgeAll();
    expect(queue.snapshot()).toHaveLength(0);
  });

  test('dispatches every mutation type', async () => {
    const repo = {
      patchProfile: jest.fn((value) => value),
      addSkill: jest.fn((value) => value),
      patchSkill: jest.fn((value) => value),
      patchProgress: jest.fn((value) => value),
      decideApproval: jest.fn((value) => value),
      assignLearning: jest.fn((value) => value),
      patchRoles: jest.fn((value) => value),
      registerFile: jest.fn((value) => value),
    } as unknown as SessionMutationRepository;
    const queue = new MutationQueue(repo);

    queue.enqueue('account-9', 'patchProfile', { associateId: '1', name: 'A', phone: 'P', address: 'X', avatar_file_id: null, cv_file_id: null }, { expectedVersion: 1 });
    queue.enqueue('account-9', 'addSkill', { associateId: '1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' });
    queue.enqueue('account-9', 'patchSkill', { associateId: '1', skillId: 'skill-1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' }, { expectedVersion: 1 });
    queue.enqueue('account-9', 'patchProgress', { associateId: '1', learningAssignmentId: 'assignment-1', status_percentage: 50, certificate_file_id: null }, { expectedVersion: 1 });
    queue.enqueue('account-9', 'decideApproval', { approvalRequestId: 'approval-1', reviewerId: 'r', decision: 'approved' }, { expectedVersion: 1 });
    queue.enqueue('account-9', 'assignLearning', { associateId: '1', learning_code: 'L', subject: 'Sub', date_due: '2026-12-31', assigned_by: 'r' });
    queue.enqueue('account-9', 'patchRoles', { associateId: '1', application_roles: ['associate'] }, { expectedVersion: 1 });
    queue.enqueue('account-9', 'registerFile', { purpose: 'cv', name: 'cv.pdf', mime_type: 'application/pdf', size_bytes: 1 });

    await expect(queue.replay('account-9')).resolves.toHaveLength(8);
    expect(repo.patchProfile).toHaveBeenCalled();
    expect(repo.addSkill).toHaveBeenCalled();
    expect(repo.patchSkill).toHaveBeenCalled();
    expect(repo.patchProgress).toHaveBeenCalled();
    expect(repo.decideApproval).toHaveBeenCalled();
    expect(repo.assignLearning).toHaveBeenCalled();
    expect(repo.patchRoles).toHaveBeenCalled();
    expect(repo.registerFile).toHaveBeenCalled();

    expect(() =>
      (queue as unknown as { dispatch(item: { operation: string }): unknown }).dispatch({ operation: 'bogus' }),
    ).toThrow();

    const queueWithoutVersions = new MutationQueue(repo);
    queueWithoutVersions.enqueue('account-9', 'patchProfile', { associateId: '1', name: 'A', phone: 'P', address: 'X', avatar_file_id: null, cv_file_id: null });
    queueWithoutVersions.enqueue('account-9', 'patchSkill', { associateId: '1', skillId: 'skill-1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' });
    queueWithoutVersions.enqueue('account-9', 'patchProgress', { associateId: '1', learningAssignmentId: 'assignment-1', status_percentage: 50, certificate_file_id: null });
    queueWithoutVersions.enqueue('account-9', 'decideApproval', { approvalRequestId: 'approval-1', reviewerId: 'r', decision: 'approved' });
    queueWithoutVersions.enqueue('account-9', 'patchRoles', { associateId: '1', application_roles: ['associate'] });
    await expect(queueWithoutVersions.replay('account-9')).resolves.toHaveLength(5);
  });

  test('skips non-pending items and records unexpected errors', async () => {
    const repo = {
      patchProfile: jest.fn(),
      addSkill: jest.fn(() => {
        throw 'boom';
      }),
      patchSkill: jest.fn(),
      patchProgress: jest.fn(),
      decideApproval: jest.fn(),
      assignLearning: jest.fn(),
      patchRoles: jest.fn(),
      registerFile: jest.fn(),
    } as unknown as SessionMutationRepository;
    const queue = new MutationQueue(repo);
    const pending = queue.enqueue('account-10', 'patchProfile', { associateId: '1', name: 'A', phone: 'P', address: 'X', avatar_file_id: null, cv_file_id: null }, { expectedVersion: 1 });
    queue.markConflict(pending.id, 'skip');
    queue.enqueue('other-account', 'addSkill', { associateId: '1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' });

    await expect(queue.replay('account-10')).resolves.toEqual([]);
    expect(repo.addSkill).not.toHaveBeenCalled();

    const failingQueue = new MutationQueue(repo);
    failingQueue.enqueue('account-10', 'addSkill', { associateId: '1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' });
    await expect(failingQueue.replay('account-10')).rejects.toBe('boom');
  });

  test('stores error messages for thrown Errors', async () => {
    const repo = {
      patchProfile: jest.fn(),
      addSkill: jest.fn(() => {
        throw new Error('boom');
      }),
      patchSkill: jest.fn(),
      patchProgress: jest.fn(),
      decideApproval: jest.fn(),
      assignLearning: jest.fn(),
      patchRoles: jest.fn(),
      registerFile: jest.fn(),
    } as unknown as SessionMutationRepository;
    const queue = new MutationQueue(repo);
    queue.enqueue('account-11', 'addSkill', { associateId: '1', skill_code: 'S', title: 'T', description: 'D', expertise: 'beginner', years_of_experience: 1, last_used: '2026-11-24' });

    await expect(queue.replay('account-11')).rejects.toThrow('boom');
  });
});
