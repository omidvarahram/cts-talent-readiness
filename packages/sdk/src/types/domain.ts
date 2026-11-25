export type ApplicationRole = 'associate' | 'manager' | 'admin';

export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next_offset: number | null;
}

export interface FileReference {
  file_id: string;
  name: string;
  mime_type: string;
  size_bytes: number;
}

export interface Identity {
  auth_user_id: string;
  associate_id: string;
  application_roles: ApplicationRole[];
}

export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  identity: Identity;
}

export interface AuthSession {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  identity: Identity;
  refreshToken?: string | null;
}

export type StaffingStatus =
  | { status: 'on_bench'; unassigned_start_date: string }
  | {
      status: 'assigned';
      assignment_code: string;
      start_date: string;
      end_date: string;
      assignment_role: string;
      billing_code: string;
    };

export interface AssociateSkill {
  skill_id: string;
  skill_code: string;
  title: string;
  description: string;
  expertise: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  last_used: string;
  approval_status: 'approved' | 'pending' | 'rejected';
  evidence: FileReference | null;
}

export interface Associate {
  associate_id: string;
  auth_user_id: string;
  associate_name: string;
  associate_email: string;
  associate_group: string;
  associate_role: string;
  date_join: string;
  associate_manager: string | null;
  associate_direct_reports: string[];
  location: string;
  skills: AssociateSkill[];
  associate_status: StaffingStatus;
  learning_assignments: string[];
  is_active: boolean;
  date_leave: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillCatalogueItem {
  skill_code: string;
  title: string;
}

export interface Learning {
  learning_code: string;
  subject: string;
  seniority_level: string;
  target_associate_roles: string[];
  skills: string[];
  description: string;
  estimated_hours: number;
  certificate_required: boolean;
  is_active: boolean;
}

export interface LearningAssignment {
  learning_assignment_id: string;
  associate_id: string;
  learning_code: string;
  subject: string;
  date_assigned: string;
  date_due: string;
  status: 'not_started' | 'in_progress' | 'completed';
  status_percentage: number;
  description: string;
  certificate_required: boolean;
  certificate: string | null;
  assigned_by: string;
  date_completed: string | null;
}

export interface ApprovalRequest {
  approval_request_id: string;
  request_type: 'skill';
  associate_id: string;
  skill_id: string;
  reviewer_id: string;
  status: 'pending' | 'approved' | 'rejected';
  date_submitted: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export interface SkillApprovalRequest {
  approval_request_id: string;
  request_type: 'skill';
  associate_id: string;
  skill_id: string;
  reviewer_id: string;
  proposed_skill: AssociateSkill;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
}

export interface ProgressApprovalRequest {
  approval_request_id: string;
  request_type: 'progress';
  associate_id: string;
  learning_assignment_id: string;
  reviewer_id: string;
  approved_percentage: number;
  proposed_percentage: number;
  certificate_file_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
}

export type ApprovalResource = SkillApprovalRequest | ProgressApprovalRequest;

export type ApprovalDecisionResult = {
  approval: SkillApprovalRequest | ProgressApprovalRequest;
  updated_resource: AssociateSkill | LearningAssignment | null;
};

export interface Profile {
  associate_id: string;
  name: string;
  phone: string;
  address: string;
  avatar_file_id: string | null;
  cv_file_id: string | null;
  onboarding_completed: boolean;
  version: number;
  updated_at: string;
}

export interface AdminUser extends Identity {
  associate_name: string;
  associate_email: string;
  version?: number;
}

export interface RuntimeConfigFeatureFlags {
  skills: boolean;
  learningAssignments: boolean;
  managerApprovals: boolean;
  adminRoleEditor: boolean;
}

export interface RuntimeConfigLabels {
  applicationName: string;
  loginTitle: string;
  addSkill: string;
}

export interface RuntimeConfigLinks {
  companyPortal: string;
}

export interface RuntimeConfigApi {
  pathPrefix: string;
  timeoutMs: number;
  pageSize: number;
}

export interface RuntimeConfigUploads {
  cvMaxBytes: number;
  skillEvidenceMaxBytes: number;
  avatarMaxBytes: number;
}

export interface RuntimeConfig {
  schemaVersion: number;
  configVersion: number;
  environment: string;
  issuedAt: string;
  expiresAt: string;
  minimumAppBuild: number;
  featureFlags: RuntimeConfigFeatureFlags;
  features?: RuntimeConfigFeatureFlags;
  labels: RuntimeConfigLabels;
  links: RuntimeConfigLinks;
  api: RuntimeConfigApi;
  uploads: RuntimeConfigUploads;
  topLevelReviewerAssociateId: string;
  allowlistedHosts: string[];
  pinningRequired: true;
}
