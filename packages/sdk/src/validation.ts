// @ts-nocheck
import { ValidationError } from './errors';
import type {
  ApiErrorEnvelope,
  AuthResponse,
  FileReference,
  RuntimeConfig,
  RuntimeConfigFeatureFlags,
} from './types/domain';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assert = (condition: unknown, message: string, field?: string): asserts condition => {
  if (!condition) {
    throw new ValidationError(message, field);
  }
};

const asString = (value: unknown, field: string): string => {
  assert(typeof value === 'string' && value.length > 0, `Invalid ${field}`, field);
  return value;
};

const asNumber = (value: unknown, field: string): number => {
  assert(typeof value === 'number' && Number.isFinite(value), `Invalid ${field}`, field);
  return value;
};

const asBoolean = (value: unknown, field: string): boolean => {
  assert(typeof value === 'boolean', `Invalid ${field}`, field);
  return value;
};

const asStringArray = (value: unknown, field: string): string[] => {
  assert(Array.isArray(value) && value.every((entry) => typeof entry === 'string'), `Invalid ${field}`, field);
  return value;
};

const asDateString = (value: unknown, field: string): string => {
  const date = asString(value, field);
  assert(/^\d{4}-\d{2}-\d{2}(T.*Z)?$/.test(date), `Invalid ${field}`, field);
  return date;
};

export function parseApiErrorEnvelope(value: unknown): ApiErrorEnvelope | null {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null;
  }
  const code = value.error.code;
  const message = value.error.message;
  if (typeof code !== 'string' || typeof message !== 'string') {
    return null;
  }
  const request_id = typeof value.error.request_id === 'string' ? value.error.request_id : undefined;
  return { error: { code, message, request_id } };
}

export function parseAuthResponse(value: unknown): AuthResponse {
  assert(isRecord(value), 'Invalid auth response');
  return {
    access_token: asString(value.access_token, 'access_token'),
    token_type: value.token_type === 'Bearer' ? 'Bearer' : (() => {
      throw new ValidationError('Invalid token_type', 'token_type');
    })(),
    expires_in: asNumber(value.expires_in, 'expires_in'),
    identity: parseIdentity(value.identity),
  };
}

function parseIdentity(value: unknown) {
  assert(isRecord(value), 'Invalid identity');
  return {
    auth_user_id: asString(value.auth_user_id, 'auth_user_id'),
    associate_id: asString(value.associate_id, 'associate_id'),
    application_roles: asStringArray(value.application_roles, 'application_roles').map((role, index) => {
      assert(role === 'associate' || role === 'manager' || role === 'admin', `Invalid application_roles[${index}]`, 'application_roles');
      return role;
    }),
  };
}

export function parseFileReference(value: unknown): FileReference {
  assert(isRecord(value), 'Invalid file reference');
  return {
    file_id: asString(value.file_id, 'file_id'),
    name: asString(value.name, 'name'),
    mime_type: asString(value.mime_type, 'mime_type'),
    size_bytes: asNumber(value.size_bytes, 'size_bytes'),
  };
}

export function parseRuntimeConfig(value: unknown): RuntimeConfig {
  assert(isRecord(value), 'Invalid runtime config');
  const featureFlags = parseFeatureFlags(value.featureFlags ?? value.features);
  const labelsSource = (value.labels ?? value.labelOverrides) as Record<string, unknown> | undefined;
  const allowlistedHosts = Array.isArray(value.allowlistedHosts)
    ? value.allowlistedHosts.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
    : [];
  assert(allowlistedHosts.length > 0, 'Invalid allowlistedHosts', 'allowlistedHosts');
  const topLevelReviewerAssociateId = typeof value.topLevelReviewerAssociateId === 'string'
    ? value.topLevelReviewerAssociateId.trim()
    : '';
  assert(topLevelReviewerAssociateId.length > 0, 'Invalid topLevelReviewerAssociateId', 'topLevelReviewerAssociateId');
  const companyPortal = asString((value.links as Record<string, unknown> | undefined)?.companyPortal, 'links.companyPortal');
  try {
    new URL(companyPortal);
  } catch {
    throw new ValidationError('Invalid links.companyPortal', 'links.companyPortal');
  }
  return {
    schemaVersion: asNumber(value.schemaVersion, 'schemaVersion'),
    configVersion: asNumber(value.configVersion, 'configVersion'),
    environment: asString(value.environment, 'environment'),
    issuedAt: asDateString(value.issuedAt, 'issuedAt'),
    expiresAt: asDateString(value.expiresAt, 'expiresAt'),
    minimumAppBuild: asNumber(value.minimumAppBuild, 'minimumAppBuild'),
    featureFlags,
    features: featureFlags,
    labels: {
      applicationName: asString(labelsSource?.applicationName, 'labels.applicationName'),
      loginTitle: asString(labelsSource?.loginTitle, 'labels.loginTitle'),
      addSkill: asString(labelsSource?.addSkill, 'labels.addSkill'),
    },
    links: { companyPortal },
    api: {
      pathPrefix: asString((value.api as Record<string, unknown>)?.pathPrefix, 'api.pathPrefix'),
      timeoutMs: asNumber((value.api as Record<string, unknown>)?.timeoutMs, 'api.timeoutMs'),
      pageSize: asNumber((value.api as Record<string, unknown>)?.pageSize, 'api.pageSize'),
    },
    uploads: {
      cvMaxBytes: asNumber((value.uploads as Record<string, unknown>)?.cvMaxBytes, 'uploads.cvMaxBytes'),
      skillEvidenceMaxBytes: asNumber((value.uploads as Record<string, unknown>)?.skillEvidenceMaxBytes, 'uploads.skillEvidenceMaxBytes'),
      avatarMaxBytes: asNumber((value.uploads as Record<string, unknown>)?.avatarMaxBytes, 'uploads.avatarMaxBytes'),
    },
    topLevelReviewerAssociateId,
    allowlistedHosts,
    pinningRequired: true,
  };
}

function parseFeatureFlags(value: unknown): RuntimeConfigFeatureFlags {
  assert(isRecord(value), 'Invalid feature flags', 'featureFlags');
  return {
    skills: asBoolean(value.skills, 'featureFlags.skills'),
    learningAssignments: asBoolean(value.learningAssignments, 'featureFlags.learningAssignments'),
    managerApprovals: asBoolean(value.managerApprovals, 'featureFlags.managerApprovals'),
    adminRoleEditor: asBoolean(value.adminRoleEditor, 'featureFlags.adminRoleEditor'),
  };
}
