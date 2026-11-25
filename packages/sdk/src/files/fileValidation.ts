import { ValidationError } from '../errors';

export type UploadPurpose = 'avatar' | 'cv' | 'skill_evidence' | 'skillEvidence' | 'certificate';

const MB = 1024 * 1024;

const PURPOSE_LIMITS: Record<UploadPurpose, number> = {
  avatar: 5 * MB,
  cv: 10 * MB,
  skill_evidence: 10 * MB,
  skillEvidence: 10 * MB,
  certificate: 10 * MB,
};

const PURPOSE_MIME_TYPES: Record<UploadPurpose, string[]> = {
  avatar: ['image/png', 'image/jpeg', 'image/webp'],
  cv: ['application/pdf'],
  skill_evidence: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  skillEvidence: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  certificate: ['application/pdf'],
};

export interface FileUploadCandidate {
  purpose: UploadPurpose;
  name: string;
  mimeType: string;
  sizeBytes: number;
}

export function validateFileUpload(candidate: FileUploadCandidate): void {
  if (candidate.sizeBytes <= 0) {
    throw new ValidationError('File must not be empty', 'sizeBytes');
  }
  const maxBytes = PURPOSE_LIMITS[candidate.purpose];
  if (candidate.sizeBytes > maxBytes) {
    throw new ValidationError('File exceeds size limit', 'sizeBytes');
  }
  const allowed = PURPOSE_MIME_TYPES[candidate.purpose];
  if (!allowed.includes(candidate.mimeType)) {
    throw new ValidationError('Unsupported file type', 'mimeType');
  }
}

export function getUploadLimit(purpose: UploadPurpose): number {
  return PURPOSE_LIMITS[purpose];
}
