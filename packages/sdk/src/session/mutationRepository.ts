import { ConflictError, NotFoundError } from '../errors';
import { validateFileUpload, type UploadPurpose } from '../files/fileValidation';
import type {
  AdminUser,
  ApprovalDecisionResult,
  AssociateSkill,
  FileReference,
  LearningAssignment,
  ProgressApprovalRequest,
  Profile,
  SkillApprovalRequest,
} from '../types/domain';

export interface MutationMeta {
  accountId?: string;
  idempotencyKey?: string;
}

export interface PatchProfileInput extends MutationMeta {
  associateId: string;
  name: string;
  phone: string;
  address: string;
  avatar_file_id: string | null;
  cv_file_id: string | null;
  expected_version: number;
}

export interface AddSkillInput extends MutationMeta {
  associateId: string;
  skill_code: string;
  title: string;
  description: string;
  expertise: AssociateSkill['expertise'];
  years_of_experience: number;
  last_used: string;
  evidence_file_id?: string;
  expected_version?: number;
}

export interface PatchSkillInput extends MutationMeta {
  associateId: string;
  skillId: string;
  skill_code: string;
  title: string;
  description: string;
  expertise: AssociateSkill['expertise'];
  years_of_experience: number;
  last_used: string;
  evidence_file_id?: string;
  expected_version: number;
}

export interface PatchProgressInput extends MutationMeta {
  associateId: string;
  learningAssignmentId: string;
  status_percentage: number;
  certificate_file_id?: string | null;
  expected_version: number;
}

export interface DecideApprovalInput extends MutationMeta {
  approvalRequestId: string;
  reviewerId: string;
  decision: 'approved' | 'rejected';
  reason?: string;
  expected_version: number;
}

export interface AssignLearningInput extends MutationMeta {
  associateId: string;
  learning_code: string;
  subject: string;
  date_due: string;
  instructions?: string;
  assigned_by: string;
}

export interface PatchRolesInput extends MutationMeta {
  associateId: string;
  application_roles: Array<'associate' | 'manager' | 'admin'>;
  expected_version: number;
}

export interface RegisterFileInput extends MutationMeta {
  purpose: UploadPurpose;
  name: string;
  mime_type: string;
  size_bytes: number;
}

type IdempotentResult = { fingerprint: string; result: unknown };

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export class SessionMutationRepository {
  private readonly profiles = new Map<string, Profile>();
  private readonly skills = new Map<string, AssociateSkill[]>();
  private readonly approvals = new Map<string, SkillApprovalRequest | ProgressApprovalRequest>();
  private readonly assignments = new Map<string, LearningAssignment>();
  private readonly adminUsers = new Map<string, AdminUser>();
  private readonly files = new Map<string, FileReference>();
  private readonly managerByAssociate = new Map<string, string | null>();
  private readonly reportsByManager = new Map<string, Set<string>>();
  private readonly idempotency = new Map<string, IdempotentResult>();
  private counters = { profile: 1, skill: 1, approval: 1, assignment: 1, file: 1 };

  constructor(private readonly topLevelReviewerAssociateId = 'top-reviewer') {
    this.seed();
  }

  patchProfile(input: PatchProfileInput): Profile {
    return this.withIdempotency(input, 'patchProfile', () => {
      const current = this.requireProfile(input.associateId);
      if (current.version !== input.expected_version) {
        throw new ConflictError('Profile version conflict', null, 'VERSION_CONFLICT');
      }
      const next: Profile = {
        ...current,
        name: input.name,
        phone: input.phone,
        address: input.address,
        avatar_file_id: input.avatar_file_id,
        cv_file_id: input.cv_file_id,
        version: current.version + 1,
        updated_at: new Date().toISOString(),
      };
      this.profiles.set(input.associateId, next);
      return clone(next);
    });
  }

  addSkill(input: AddSkillInput): { skill: AssociateSkill; approval: SkillApprovalRequest } {
    return this.withIdempotency(input, 'addSkill', () => {
      const nextSkill: AssociateSkill = {
        skill_id: `skill-${this.counters.skill++}`,
        skill_code: input.skill_code,
        title: input.title,
        description: input.description,
        expertise: input.expertise,
        years_of_experience: input.years_of_experience,
        last_used: input.last_used,
        approval_status: 'pending',
        evidence: input.evidence_file_id ? this.files.get(input.evidence_file_id) ?? null : null,
      };
      const reviewerId = this.resolveReviewer(input.associateId);
      const approval: SkillApprovalRequest = {
        approval_request_id: `approval-${this.counters.approval++}`,
        request_type: 'skill',
        associate_id: input.associateId,
        skill_id: nextSkill.skill_id,
        reviewer_id: reviewerId,
        proposed_skill: clone(nextSkill),
        status: 'pending',
        version: 1,
      };
      this.skills.set(input.associateId, [...(this.skills.get(input.associateId) ?? []), nextSkill]);
      this.approvals.set(approval.approval_request_id, approval);
      return { skill: clone(nextSkill), approval: clone(approval) };
    });
  }

  patchSkill(input: PatchSkillInput): SkillApprovalRequest {
    return this.withIdempotency(input, 'patchSkill', () => {
      const currentSkills = this.skills.get(input.associateId) ?? [];
      const current = currentSkills.find((skill) => skill.skill_id === input.skillId);
      if (!current) {
        throw new NotFoundError('Skill not found');
      }
      const existingApproval = [...this.approvals.values()].find(
        (approval): approval is SkillApprovalRequest =>
          approval.request_type === 'skill' && approval.skill_id === input.skillId && approval.status === 'pending',
      );
      if (existingApproval) {
        throw new ConflictError('A pending skill approval already exists', null, 'DUPLICATE_PENDING_CHANGE');
      }
      const proposed: AssociateSkill = {
        ...current,
        skill_code: input.skill_code,
        title: input.title,
        description: input.description,
        expertise: input.expertise,
        years_of_experience: input.years_of_experience,
        last_used: input.last_used,
      };
      const approval: SkillApprovalRequest = {
        approval_request_id: `approval-${this.counters.approval++}`,
        request_type: 'skill',
        associate_id: input.associateId,
        skill_id: input.skillId,
        reviewer_id: this.resolveReviewer(input.associateId),
        proposed_skill: clone(proposed),
        status: 'pending',
        version: input.expected_version,
      };
      this.approvals.set(approval.approval_request_id, approval);
      return clone(approval);
    });
  }

  patchProgress(input: PatchProgressInput): ProgressApprovalRequest {
    return this.withIdempotency(input, 'patchProgress', () => {
      const assignment = this.requireAssignment(input.learningAssignmentId);
      if (assignment.associate_id !== input.associateId) {
        throw new ConflictError('Assignment ownership mismatch', null, 'FORBIDDEN');
      }
      if (assignment.status_percentage === input.status_percentage && assignment.certificate === (input.certificate_file_id ?? null)) {
        throw new ConflictError('No progress change requested', null, 'DUPLICATE_PENDING_CHANGE');
      }
      const approval: ProgressApprovalRequest = {
        approval_request_id: `approval-${this.counters.approval++}`,
        request_type: 'progress',
        associate_id: input.associateId,
        learning_assignment_id: input.learningAssignmentId,
        reviewer_id: this.resolveReviewer(input.associateId),
        approved_percentage: assignment.status_percentage,
        proposed_percentage: input.status_percentage,
        certificate_file_id: input.certificate_file_id ?? null,
        status: 'pending',
        version: input.expected_version,
      };
      this.approvals.set(approval.approval_request_id, approval);
      return clone(approval);
    });
  }

  decideApproval(input: DecideApprovalInput): ApprovalDecisionResult {
    return this.withIdempotency(input, 'decideApproval', () => {
      const approval = this.approvals.get(input.approvalRequestId);
      if (!approval) {
        throw new NotFoundError('Approval request not found');
      }
      if (approval.reviewer_id !== input.reviewerId) {
        throw new ConflictError('Reviewer mismatch', null, 'FORBIDDEN');
      }
      if (approval.associate_id === input.reviewerId) {
        throw new ConflictError('Self-approval is not allowed', null, 'FORBIDDEN');
      }
      if (input.decision === 'rejected' && !input.reason) {
        throw new ConflictError('Rejection reason is required', null, 'VALIDATION_ERROR');
      }
      if (approval.version !== input.expected_version) {
        throw new ConflictError('Approval version conflict', null, 'VERSION_CONFLICT');
      }

      if (approval.request_type === 'skill') {
        const skillList = this.skills.get(approval.associate_id) ?? [];
        const existing = skillList.find((skill) => skill.skill_id === approval.skill_id);
        if (!existing) {
          throw new NotFoundError('Skill not found');
        }
        const updatedSkill = input.decision === 'approved' ? { ...approval.proposed_skill, approval_status: 'approved' as const } : { ...existing, approval_status: 'rejected' as const };
        this.skills.set(
          approval.associate_id,
          skillList.map((skill) => (skill.skill_id === approval.skill_id ? updatedSkill : skill)),
        );
        const nextApproval: SkillApprovalRequest = { ...approval, status: input.decision, version: approval.version + 1 };
        this.approvals.set(approval.approval_request_id, nextApproval);
        return { approval: clone(nextApproval), updated_resource: input.decision === 'approved' ? clone(updatedSkill) : null };
      }

      const assignment = this.requireAssignment(approval.learning_assignment_id);
      const updatedAssignment: LearningAssignment =
        input.decision === 'approved'
          ? {
              ...assignment,
              status_percentage: approval.proposed_percentage,
              certificate: approval.certificate_file_id,
              date_completed: approval.proposed_percentage >= 100 ? new Date().toISOString() : assignment.date_completed,
              status: approval.proposed_percentage >= 100 ? 'completed' : 'in_progress',
            }
          : assignment;
      this.assignments.set(assignment.learning_assignment_id, updatedAssignment);
      const nextApproval: ProgressApprovalRequest = { ...approval, status: input.decision, version: approval.version + 1 };
      this.approvals.set(approval.approval_request_id, nextApproval);
      return { approval: clone(nextApproval), updated_resource: input.decision === 'approved' ? clone(updatedAssignment) : null };
    });
  }

  assignLearning(input: AssignLearningInput): LearningAssignment {
    return this.withIdempotency(input, 'assignLearning', () => {
      const manager = this.managerByAssociate.get(input.associateId);
      if (manager && manager !== input.assigned_by && input.assigned_by !== this.topLevelReviewerAssociateId) {
        throw new ConflictError('Only the direct manager may assign learning', null, 'FORBIDDEN');
      }
      const duplicate = [...this.assignments.values()].find(
        (assignment) =>
          assignment.associate_id === input.associateId &&
          assignment.learning_code === input.learning_code &&
          assignment.status !== 'completed',
      );
      if (duplicate) {
        throw new ConflictError('Duplicate active learning assignment', null, 'DUPLICATE_PENDING_CHANGE');
      }
      const assignment: LearningAssignment = {
        learning_assignment_id: `assignment-${this.counters.assignment++}`,
        associate_id: input.associateId,
        learning_code: input.learning_code,
        subject: input.subject,
        date_assigned: new Date().toISOString().slice(0, 10),
        date_due: input.date_due,
        status: 'not_started',
        status_percentage: 0,
        description: input.instructions ?? '',
        certificate_required: false,
        certificate: null,
        assigned_by: input.assigned_by,
        date_completed: null,
      };
      this.assignments.set(assignment.learning_assignment_id, assignment);
      return clone(assignment);
    });
  }

  patchRoles(input: PatchRolesInput): AdminUser {
    return this.withIdempotency(input, 'patchRoles', () => {
      const current = this.requireAdminUser(input.associateId);
      if (!input.application_roles.length) {
        throw new ConflictError('At least one role is required', null, 'VALIDATION_ERROR');
      }
      const nextRoles = [...new Set(input.application_roles)];
      if (current.application_roles.includes('admin') && !nextRoles.includes('admin') && this.adminUsers.size === 1) {
        throw new ConflictError('At least one admin role must remain', null, 'FORBIDDEN');
      }
      const hadManager = current.application_roles.includes('manager');
      const hasManager = nextRoles.includes('manager');
      const next: AdminUser = { ...current, application_roles: nextRoles, version: (current.version ?? 0) + 1 };
      this.adminUsers.set(next.associate_id, next);
      if (hadManager && !hasManager) {
        this.reassignReports(input.associateId);
      }
      return clone(next);
    });
  }

  registerFile(input: RegisterFileInput): FileReference {
    return this.withIdempotency(input, 'registerFile', () => {
      validateFileUpload({
        purpose: input.purpose,
        name: input.name,
        mimeType: input.mime_type,
        sizeBytes: input.size_bytes,
      });
      const file: FileReference = {
        file_id: `file-${this.counters.file++}`,
        name: input.name,
        mime_type: input.mime_type,
        size_bytes: input.size_bytes,
      };
      this.files.set(file.file_id, file);
      return clone(file);
    });
  }

  private seed(): void {
    const profile: Profile = {
      associate_id: '6100001',
      name: 'Alex Morgan',
      phone: '555-0100',
      address: '1 Talent Way',
      avatar_file_id: null,
      cv_file_id: null,
      onboarding_completed: false,
      version: 1,
      updated_at: '2026-11-23T00:00:00Z',
    };
    this.profiles.set(profile.associate_id, profile);
    const skill: AssociateSkill = {
      skill_id: 'skill-1',
      skill_code: 'AWS-1',
      title: 'AWS',
      description: 'Cloud fundamentals',
      expertise: 'intermediate',
      years_of_experience: 2,
      last_used: '2026-11-01',
      approval_status: 'approved',
      evidence: null,
    };
    this.skills.set(profile.associate_id, [skill]);
    const assignment: LearningAssignment = {
      learning_assignment_id: 'assignment-1',
      associate_id: profile.associate_id,
      learning_code: 'LEARN-1',
      subject: 'Learning basics',
      date_assigned: '2026-11-20',
      date_due: '2026-12-01',
      status: 'not_started',
      status_percentage: 0,
      description: 'Seed assignment',
      certificate_required: false,
      certificate: null,
      assigned_by: this.topLevelReviewerAssociateId,
      date_completed: null,
    };
    this.assignments.set(assignment.learning_assignment_id, assignment);
    const manager: AdminUser = {
      auth_user_id: 'dummy-user-6100001',
      associate_id: profile.associate_id,
      application_roles: ['associate', 'manager', 'admin'],
      associate_name: profile.name,
      associate_email: 'alex.morgan@example.com',
      version: 1,
    };
    this.adminUsers.set(manager.associate_id, manager);
    this.managerByAssociate.set('6100004', profile.associate_id);
    this.reportsByManager.set(profile.associate_id, new Set(['6100004']));
  }

  private requireProfile(associateId: string): Profile {
    const profile = this.profiles.get(associateId);
    if (!profile) {
      const next: Profile = {
        associate_id: associateId,
        name: '',
        phone: '',
        address: '',
        avatar_file_id: null,
        cv_file_id: null,
        onboarding_completed: false,
        version: 0,
        updated_at: new Date().toISOString(),
      };
      this.profiles.set(associateId, next);
      return next;
    }
    return profile;
  }

  private requireAssignment(learningAssignmentId: string): LearningAssignment {
    const assignment = this.assignments.get(learningAssignmentId);
    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }
    return assignment;
  }

  private requireAdminUser(associateId: string): AdminUser {
    const current = this.adminUsers.get(associateId);
    if (current) {
      return current;
    }
    const next: AdminUser = {
      auth_user_id: `dummy-user-${associateId}`,
      associate_id: associateId,
      application_roles: ['associate'],
      associate_name: '',
      associate_email: '',
      version: 0,
    };
    this.adminUsers.set(associateId, next);
    return next;
  }

  private resolveReviewer(associateId: string): string {
    const manager = this.managerByAssociate.get(associateId);
    if (manager && manager !== associateId) {
      return manager;
    }
    return this.topLevelReviewerAssociateId;
  }

  private reassignReports(managerId: string): void {
    const reports = this.reportsByManager.get(managerId);
    if (!reports?.size) {
      return;
    }
    const nextManager = this.topLevelReviewerAssociateId;
    if (nextManager === managerId) {
      throw new ConflictError('Cannot reassign reports to self', null, 'FORBIDDEN');
    }
    for (const reportId of reports) {
      this.managerByAssociate.set(reportId, nextManager);
      const nextReports = this.reportsByManager.get(nextManager) ?? new Set<string>();
      nextReports.add(reportId);
      this.reportsByManager.set(nextManager, nextReports);
    }
    this.reportsByManager.delete(managerId);
  }

  private withIdempotency<T extends MutationMeta, TResult>(input: T, operation: string, handler: () => TResult): TResult {
    if (!input.idempotencyKey) {
      return handler();
    }
    const key = `${input.accountId ?? 'default'}:${operation}:${input.idempotencyKey}`;
    const fingerprint = JSON.stringify(input);
    const existing = this.idempotency.get(key);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new ConflictError('Idempotency key reused with different payload', null, 'IDEMPOTENCY_CONFLICT');
      }
      return clone(existing.result as TResult);
    }
    const result = handler();
    this.idempotency.set(key, { fingerprint, result: clone(result) });
    return clone(result);
  }
}
