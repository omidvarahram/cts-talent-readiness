import { ValidationError } from '../errors';
import { parseRuntimeConfig } from '../validation';
import type { RuntimeConfig } from '../types/domain';
import type { ConfigManagerOptions, ConfigManagerValidationResult } from './types';

export class ConfigManager {
  constructor(private readonly options: ConfigManagerOptions) {}

  validate(rawConfig: unknown): ConfigManagerValidationResult<RuntimeConfig> {
    const normalized = this.normalize(rawConfig);
    const config = parseRuntimeConfig(normalized);
    if (config.minimumAppBuild < this.options.minimumAppBuild) {
      throw new ValidationError('Minimum app build is too low', 'minimumAppBuild');
    }
    if (!config.topLevelReviewerAssociateId) {
      throw new ValidationError('Top-level reviewer is required', 'topLevelReviewerAssociateId');
    }
    if (!config.allowlistedHosts.length) {
      throw new ValidationError('At least one allowlisted host is required', 'allowlistedHosts');
    }
    if (config.pinningRequired !== true) {
      throw new ValidationError('Pinning cannot be disabled', 'pinningRequired');
    }
    this.rejectSecrets(normalized);
    return { config, warnings: [] };
  }

  private normalize(rawConfig: unknown): RuntimeConfig {
    if (typeof rawConfig !== 'object' || rawConfig === null) {
      throw new ValidationError('Invalid runtime config');
    }
    const value = rawConfig as Record<string, unknown>;
    const links = value.links as Record<string, unknown> | undefined;
    const derivedHosts = new Set<string>(this.options.allowlistedHosts);
    const companyPortal = links && typeof links.companyPortal === 'string' ? links.companyPortal : undefined;
    if (companyPortal) {
      try {
        derivedHosts.add(new URL(companyPortal).host);
      } catch {
        throw new ValidationError('Invalid company portal URL', 'links.companyPortal');
      }
    }

    return {
      ...(value as Omit<RuntimeConfig, 'featureFlags' | 'allowlistedHosts' | 'topLevelReviewerAssociateId' | 'pinningRequired'>),
      featureFlags: (value.featureFlags ?? value.features ?? {
        skills: false,
        learningAssignments: false,
        managerApprovals: false,
        adminRoleEditor: false,
      }) as RuntimeConfig['featureFlags'],
      features: (value.featureFlags ?? value.features ?? undefined) as RuntimeConfig['features'],
      topLevelReviewerAssociateId:
        typeof value.topLevelReviewerAssociateId === 'string' && value.topLevelReviewerAssociateId.length > 0
          ? value.topLevelReviewerAssociateId
          : this.options.defaultTopLevelReviewerAssociateId,
      allowlistedHosts: [...derivedHosts],
      pinningRequired: true,
    };
  }

  private rejectSecrets(value: unknown): void {
    const text = JSON.stringify(value).toLowerCase();
    if (text.includes('secret') || text.includes('token') || text.includes('password')) {
      throw new ValidationError('Runtime config must not contain secrets');
    }
  }
}
