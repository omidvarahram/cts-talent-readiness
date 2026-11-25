import { ValidationError } from '../errors';
import { ConfigManager } from './configManager';
import * as validation from '../validation';

const baseConfig = {
  schemaVersion: 1,
  configVersion: 1,
  environment: 'demo',
  issuedAt: '2026-11-23T00:00:00Z',
  expiresAt: '2026-11-30T00:00:00Z',
  minimumAppBuild: 2,
  features: {
    skills: true,
    learningAssignments: true,
    managerApprovals: true,
    adminRoleEditor: true,
  },
  labels: { applicationName: 'Talent Readiness', loginTitle: 'Welcome back', addSkill: 'Add new skills' },
  links: { companyPortal: 'https://onecognizant.cognizant.com/' },
  api: { pathPrefix: '/v1', timeoutMs: 15000, pageSize: 20 },
  uploads: { cvMaxBytes: 5, skillEvidenceMaxBytes: 5, avatarMaxBytes: 5 },
};

describe('ConfigManager', () => {
  test('normalizes example config and validates allowlists', () => {
    const manager = new ConfigManager({
      minimumAppBuild: 1,
      defaultTopLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['127.0.0.1'],
    });

    const result = manager.validate(baseConfig);
    expect(result.config.topLevelReviewerAssociateId).toBe('reviewer-1');
    expect(result.config.allowlistedHosts).toContain('onecognizant.cognizant.com');
    expect(result.config.pinningRequired).toBe(true);
  });

  test('rejects low builds, invalid urls and secret material', () => {
    const validatingManager = new ConfigManager({
      minimumAppBuild: 1,
      defaultTopLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['127.0.0.1'],
    });
    const strictManager = new ConfigManager({
      minimumAppBuild: 3,
      defaultTopLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['127.0.0.1'],
    });

    expect(() => validatingManager.validate(null)).toThrow(ValidationError);
    expect(() => validatingManager.validate(baseConfig)).not.toThrow();
    expect(() => strictManager.validate(baseConfig)).toThrow(ValidationError);
    expect(() => validatingManager.validate({ ...baseConfig, links: { companyPortal: 'not-a-url' } })).toThrow(ValidationError);
    expect(() => validatingManager.validate({ ...baseConfig, secret: 'nope' })).toThrow(ValidationError);

    const defaultFlags = validatingManager.validate({
      ...baseConfig,
      features: undefined,
      featureFlags: undefined,
    });
    expect(defaultFlags.config.featureFlags.adminRoleEditor).toBe(false);
  });

  test('rejects missing reviewer and allowlisted hosts', () => {
    const manager = new ConfigManager({
      minimumAppBuild: 1,
      defaultTopLevelReviewerAssociateId: '',
      allowlistedHosts: [],
    });

    expect(() =>
      manager.validate({
        schemaVersion: 1,
        configVersion: 1,
        expiresAt: '2026-12-31T00:00:00.000Z',
        topLevelReviewerAssociateId: '',
        allowlistedHosts: [],
      }),
    ).toThrow(ValidationError);
  });

  test('covers validation guard rails', () => {
    const manager = new ConfigManager({
      minimumAppBuild: 10,
      defaultTopLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
    });

    const parser = jest.spyOn(validation, 'parseRuntimeConfig');
    parser.mockReturnValue({
      ...baseConfig,
      minimumAppBuild: 1,
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
      pinningRequired: true,
    } as never);
    expect(() => manager.validate(baseConfig)).toThrow('Minimum app build is too low');

    parser.mockReturnValue({
      ...baseConfig,
      minimumAppBuild: 20,
      topLevelReviewerAssociateId: '',
      allowlistedHosts: ['example.com'],
      pinningRequired: true,
    } as never);
    expect(() => manager.validate(baseConfig)).toThrow('Top-level reviewer is required');

    parser.mockReturnValue({
      ...baseConfig,
      minimumAppBuild: 20,
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: [],
      pinningRequired: true,
    } as never);
    expect(() => manager.validate(baseConfig)).toThrow('At least one allowlisted host is required');

    parser.mockReturnValue({
      ...baseConfig,
      minimumAppBuild: 20,
      topLevelReviewerAssociateId: 'reviewer-1',
      allowlistedHosts: ['example.com'],
      pinningRequired: false,
    } as never);
    expect(() => manager.validate(baseConfig)).toThrow('Pinning cannot be disabled');
  });

  test('uses the default top-level reviewer when missing', () => {
    const manager = new ConfigManager({
      minimumAppBuild: 1,
      defaultTopLevelReviewerAssociateId: 'reviewer-default',
      allowlistedHosts: ['example.com'],
    });

    const config = (manager as unknown as { normalize: (raw: unknown) => { topLevelReviewerAssociateId: string } }).normalize({
      ...baseConfig,
      pinningRequired: true,
      topLevelReviewerAssociateId: undefined,
    } as unknown as typeof baseConfig);
    expect(config.topLevelReviewerAssociateId).toBe('reviewer-default');
  });

  test('preserves an explicit top-level reviewer', () => {
    const manager = new ConfigManager({
      minimumAppBuild: 1,
      defaultTopLevelReviewerAssociateId: 'reviewer-default',
      allowlistedHosts: ['example.com'],
    });

    const config = (manager as unknown as { normalize: (raw: unknown) => { topLevelReviewerAssociateId: string } }).normalize({
      ...baseConfig,
      pinningRequired: true,
      topLevelReviewerAssociateId: 'reviewer-explicit',
    } as unknown as typeof baseConfig);
    expect(config.topLevelReviewerAssociateId).toBe('reviewer-explicit');
  });
});
