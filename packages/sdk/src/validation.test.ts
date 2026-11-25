import { ValidationError } from './errors';
import { parseApiErrorEnvelope, parseAuthResponse, parseFileReference, parseRuntimeConfig } from './validation';

describe('validation', () => {
  test('parses api error envelopes', () => {
    expect(parseApiErrorEnvelope(null)).toBeNull();
    expect(parseApiErrorEnvelope({ nope: true })).toBeNull();
    expect(parseApiErrorEnvelope({ error: { code: 123, message: 'm' } })).toBeNull();
    expect(parseApiErrorEnvelope({ error: { code: 'E', message: 'm' } })).toEqual({
      error: { code: 'E', message: 'm', request_id: undefined },
    });
    expect(parseApiErrorEnvelope({ error: { code: 'E', message: 'm', request_id: 'r' } })).toEqual({
      error: { code: 'E', message: 'm', request_id: 'r' },
    });
  });

  test('parses auth responses and file references', () => {
    expect(
      parseAuthResponse({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
        identity: { auth_user_id: 'u-1', associate_id: 'a-1', application_roles: ['associate', 'manager'] },
      }),
    ).toEqual({
      access_token: 'token',
      token_type: 'Bearer',
      expires_in: 3600,
      identity: { auth_user_id: 'u-1', associate_id: 'a-1', application_roles: ['associate', 'manager'] },
    });

    expect(parseFileReference({ file_id: 'f-1', name: 'cv.pdf', mime_type: 'application/pdf', size_bytes: 10 })).toEqual({
      file_id: 'f-1',
      name: 'cv.pdf',
      mime_type: 'application/pdf',
      size_bytes: 10,
    });
    expect(() =>
      parseAuthResponse({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
        identity: { auth_user_id: 'u-1', associate_id: 'a-1', application_roles: ['guest'] },
      }),
    ).toThrow(ValidationError);
  });

  test('parses normalized runtime config', () => {
    const config = parseRuntimeConfig({
      schemaVersion: 1,
      configVersion: 2,
      environment: 'demo',
      issuedAt: '2026-11-23T00:00:00Z',
      expiresAt: '2026-11-30T00:00:00Z',
      minimumAppBuild: 1,
      featureFlags: {
        skills: true,
        learningAssignments: true,
        managerApprovals: true,
        adminRoleEditor: true,
      },
      labels: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
      links: { companyPortal: 'https://example.com' },
      api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
      uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
    });

    expect(config.topLevelReviewerAssociateId).toBe('reviewer-1');
    expect(config.pinningRequired).toBe(true);
    expect(config.features?.skills).toBe(true);

    const featureMapConfig = parseRuntimeConfig({
      schemaVersion: 1,
      configVersion: 4,
      environment: 'demo',
      issuedAt: '2026-11-23T00:00:00Z',
      expiresAt: '2026-11-30T00:00:00Z',
      minimumAppBuild: 1,
      features: {
        skills: false,
        learningAssignments: false,
        managerApprovals: false,
        adminRoleEditor: false,
      },
      labels: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
      links: { companyPortal: 'https://example.com' },
      api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
      uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
    });
    expect(featureMapConfig.features?.skills).toBe(false);

    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        configVersion: 5,
        environment: 'demo',
        issuedAt: '2026-11-23T00:00:00Z',
        expiresAt: '2026-11-30T00:00:00Z',
        minimumAppBuild: 1,
        featureFlags: {
          skills: true,
          learningAssignments: true,
          managerApprovals: true,
          adminRoleEditor: true,
        },
        labels: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
        links: { companyPortal: 'not-a-url' },
        api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
        uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
        topLevelReviewerAssociateId: 'reviewer-1',
        allowlistedHosts: ['example.com'],
      }),
    ).toThrow(ValidationError);

    const labelOverrideConfig = parseRuntimeConfig({
      schemaVersion: 1,
      configVersion: 3,
      environment: 'demo',
      issuedAt: '2026-11-23T00:00:00Z',
      expiresAt: '2026-11-30T00:00:00Z',
      minimumAppBuild: 1,
      featureFlags: {
        skills: true,
        learningAssignments: true,
        managerApprovals: true,
        adminRoleEditor: true,
      },
      labelOverrides: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
      links: { companyPortal: 'https://example.com' },
      api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
      uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
    });
    expect(labelOverrideConfig.labels.applicationName).toBe('App');
  });

  test('rejects invalid inputs', () => {
    expect(() => parseAuthResponse(null as never)).toThrow(ValidationError);
    expect(() => parseFileReference(null as never)).toThrow(ValidationError);
    expect(() => parseRuntimeConfig(null as never)).toThrow(ValidationError);
    expect(() =>
      parseAuthResponse({
        access_token: 'token',
        token_type: 'NotBearer',
        expires_in: 3600,
        identity: { auth_user_id: 'u-1', associate_id: 'a-1', application_roles: ['associate'] },
      }),
    ).toThrow(ValidationError);

    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        configVersion: 2,
        environment: 'demo',
        issuedAt: '2026-11-23T00:00:00Z',
        expiresAt: '2026-11-30T00:00:00Z',
        minimumAppBuild: 1,
        featureFlags: { skills: true, learningAssignments: true, managerApprovals: true, adminRoleEditor: true },
        labels: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
        links: { companyPortal: 'bad-url' },
        api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
        uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
        allowlistedHosts: ['example.com'],
      }),
    ).toThrow(ValidationError);

    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        configVersion: 6,
        environment: 'demo',
        issuedAt: '2026-11-23T00:00:00Z',
        expiresAt: '2026-11-30T00:00:00Z',
        minimumAppBuild: 1,
        featureFlags: {
          skills: true,
          learningAssignments: true,
          managerApprovals: true,
          adminRoleEditor: true,
        },
        labels: { applicationName: 'App', loginTitle: 'Hi', addSkill: 'Add' },
        links: { companyPortal: 'https://example.com' },
        api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
        uploads: { cvMaxBytes: 1, skillEvidenceMaxBytes: 1, avatarMaxBytes: 1 },
        topLevelReviewerAssociateId: 'reviewer-1',
        allowlistedHosts: 'example.com',
      } as unknown),
    ).toThrow(ValidationError);
  });
});
