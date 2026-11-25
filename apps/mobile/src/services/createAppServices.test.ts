import { createAppServices, APP_REFRESH_KEY } from './createAppServices';
import { bundledBootstrap } from '../config/bundledBootstrap';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(async () => {
    throw new Error('offline');
  }) as any;
});

afterEach(() => {
  global.fetch = originalFetch;
});

function createJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

it('creates services and runs the local mutation flow', async () => {
  const services = createAppServices();

  await expect(services.bootstrap()).resolves.toMatchObject({
    topLevelReviewerAssociateId: expect.any(String),
  });

  await expect(services.restoreSession()).resolves.toBeNull();

  await expect(services.portal.signIn()).rejects.toThrow('Portal credentials are required');
  services.portal.queueCredentials({ associateId: 'A123', password: 'secret' } as any);
  await expect(services.portal.signIn()).resolves.toEqual({
    associateId: 'A123',
    password: 'secret',
  });
  services.portal.clearQueuedCredentials();

  await expect(
    services.authenticateWithCredentials({
      associateId: '6100001',
      password: 'secret',
    } as any),
  ).rejects.toThrow('Credentials are required');

  await expect(services.authenticateWithPortal()).rejects.toThrow('Portal credentials are required');

  await expect(
    services.persistDemoRefreshToken({
      identity: { associate_id: '6100001' },
    } as any),
  ).resolves.toBeUndefined();

  await expect(services.loadWorkspace()).resolves.toEqual(
    expect.objectContaining({
      profile: expect.any(Object),
      skills: expect.any(Array),
      assignments: expect.any(Array),
      approvals: expect.any(Array),
      team: expect.any(Array),
      users: expect.any(Array),
      learnings: expect.any(Array),
    }),
  );

  await expect(
    services.saveProfile({
      associateId: '6100001',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '555-0101',
      address: '1 Infinite Loop',
      avatarFileId: null,
      cvFileId: null,
      expectedVersion: 1,
    } as any),
  ).resolves.toBeDefined();

  await expect(
    services.saveSkill('6100001', {
      skill_code: 'SK-100',
      title: 'Expo',
      description: 'Cross-platform delivery',
      expertise: 'intermediate',
      years_of_experience: 4,
      last_used: '2026-11-24',
    } as any),
  ).resolves.toBeDefined();

  await expect(
    services.saveProgress('6100001', 'assignment-1', 60),
  ).resolves.toBeDefined();

  await expect(
    services.assignLearning({
      associateId: '6100001',
      learningCode: 'LEARN-01',
      subject: 'Secure delivery',
      dateDue: '2026-12-24',
      instructions: 'Finish module 1',
      assignedBy: 'system',
    } as any),
  ).resolves.toBeDefined();

  await expect(
    services.patchRoles({
      associateId: bundledBootstrap.topLevelReviewerAssociateId,
      applicationRoles: ['associate', 'manager'],
      expectedVersion: 1,
    } as any),
  ).resolves.toBeDefined();

  await expect(services.logout()).resolves.toBeUndefined();
});

it('authenticates and forwards mutation methods', async () => {
  const storage = {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
  };
  const fetchImpl = jest.fn(async () =>
    createJsonResponse({
      access_token: 'access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      identity: {
        auth_user_id: 'auth-user-1',
        associate_id: 'A123456',
        application_roles: ['associate'],
      },
    }),
  ) as any;
  const services = createAppServices({ fetchImpl, storage: storage as any });
  const profile = {
    associateId: 'A123456',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '555-0101',
    address: '1 Infinite Loop',
    avatarFileId: null,
    cvFileId: null,
    expectedVersion: 1,
  };
  const skill = {
    skill_code: 'SK-100',
    title: 'Expo',
    description: 'Cross-platform delivery',
    expertise: 'intermediate',
    years_of_experience: 4,
    last_used: '2026-11-24',
  };

  const patchProfile = jest.spyOn(services.sessionMutationRepository as any, 'patchProfile').mockResolvedValue({
    associate_id: 'A123456',
  } as any);
  const addSkill = jest.spyOn(services.sessionMutationRepository as any, 'addSkill').mockResolvedValue({
    skill: { skill_code: 'SK-100' },
    approval: { approval_request_id: 'approval-1' },
  } as any);
  const patchProgress = jest.spyOn(services.sessionMutationRepository as any, 'patchProgress').mockResolvedValue({
    learning_assignment_id: 'assignment-1',
  } as any);
  const assignLearning = jest.spyOn(services.sessionMutationRepository as any, 'assignLearning').mockResolvedValue({
    learning_assignment_id: 'assignment-2',
  } as any);
  const patchRoles = jest.spyOn(services.sessionMutationRepository as any, 'patchRoles').mockResolvedValue({
    associate_id: 'A300003',
    application_roles: ['associate', 'manager'],
  } as any);
  const purgeAll = jest.spyOn(services.mutationQueue as any, 'purgeAll').mockResolvedValue(undefined);

  await expect(
    services.authenticateWithCredentials({
      email: 'ada@example.com',
      associateId: 'A123456',
    } as any),
  ).resolves.toMatchObject({
    identity: { associate_id: 'A123456' },
  });

  services.portal.queueCredentials({
    email: 'ada@example.com',
    associateId: 'A123456',
  } as any);
  await expect(services.authenticateWithPortal()).resolves.toMatchObject({
    identity: { associate_id: 'A123456' },
  });

  expect(storage.setItem).toHaveBeenCalledWith(APP_REFRESH_KEY, 'demo-A123456');

  await expect(services.saveProfile(profile as any)).resolves.toEqual({ associate_id: 'A123456' });
  await expect(services.saveSkill('A123456', skill as any)).resolves.toEqual({
    skill: { skill_code: 'SK-100' },
    approval: { approval_request_id: 'approval-1' },
  });
  await expect(services.saveProgress('A123456', 'assignment-1', 60)).resolves.toEqual({
    learning_assignment_id: 'assignment-1',
  });
  await expect(
    services.assignLearning({
      associateId: 'A123456',
      learningCode: 'LEARN-01',
      subject: 'Secure delivery',
      dueDate: '2026-12-24',
      instructions: 'Finish module 1',
      assignedBy: 'system',
    } as any),
  ).resolves.toEqual({ learning_assignment_id: 'assignment-2' });
  await expect(
    services.patchRoles({
      associateId: 'A300003',
      applicationRoles: ['associate', 'manager'],
      expectedVersion: 1,
    } as any),
  ).resolves.toEqual({
    associate_id: 'A300003',
    application_roles: ['associate', 'manager'],
  });
  await expect(services.logout()).resolves.toBeUndefined();

  expect(patchProfile).toHaveBeenCalledWith({
    associateId: 'A123456',
    name: 'Ada Lovelace',
    phone: '555-0101',
    address: '1 Infinite Loop',
    avatar_file_id: undefined,
    cv_file_id: undefined,
    expected_version: 1,
  });
  expect(addSkill).toHaveBeenCalledWith({
    associateId: 'A123456',
    skill_code: 'SK-100',
    title: 'Expo',
    description: 'Cross-platform delivery',
    expertise: 'intermediate',
    years_of_experience: 4,
    last_used: '2026-11-24',
  });
  expect(patchProgress).toHaveBeenCalledWith({
    associateId: 'A123456',
    learningAssignmentId: 'assignment-1',
    status_percentage: 60,
    expected_version: 1,
  });
  expect(assignLearning).toHaveBeenCalledWith({
    associateId: 'A123456',
    learning_code: 'LEARN-01',
    subject: 'Secure delivery',
    date_due: '2026-12-24',
    instructions: 'Finish module 1',
    assigned_by: 'system',
  });
  expect(patchRoles).toHaveBeenCalledWith({
    associateId: 'A300003',
    application_roles: ['associate', 'manager'],
    expected_version: 1,
  });
  expect(purgeAll).toHaveBeenCalled();
  expect(storage.clear).toHaveBeenCalled();
});
