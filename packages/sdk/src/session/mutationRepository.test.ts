// @ts-nocheck
import { ConflictError, NotFoundError } from '../errors';
import { SessionMutationRepository } from './mutationRepository';

describe('SessionMutationRepository', () => {
  test('patches profiles with versioning and idempotency', () => {
    const repo = new SessionMutationRepository('reviewer-1');
    const first = repo.patchProfile({
      associateId: '6100001',
      name: 'Alex Updated',
      phone: '555-0101',
      address: '2 Talent Way',
      avatar_file_id: null,
      cv_file_id: null,
      expected_version: 1,
      idempotencyKey: 'profile-1',
    });
    const second = repo.patchProfile({
      associateId: '6100001',
      name: 'Alex Updated',
      phone: '555-0101',
      address: '2 Talent Way',
      avatar_file_id: null,
      cv_file_id: null,
      expected_version: 1,
      idempotencyKey: 'profile-1',
    });

    expect(first.version).toBe(2);
    expect(second).toEqual(first);
    expect(() =>
      repo.patchProfile({
        associateId: '6100001',
        name: 'Different',
        phone: '555-0109',
        address: '9 Talent Way',
        avatar_file_id: null,
        cv_file_id: null,
        expected_version: 1,
        idempotencyKey: 'profile-1',
      }),
    ).toThrow(ConflictError);
    expect(() =>
      repo.patchProfile({
        associateId: '6100001',
        name: 'Bad',
        phone: 'x',
        address: 'y',
        avatar_file_id: null,
        cv_file_id: null,
        expected_version: 1,
      }),
    ).toThrow(ConflictError);
  });

  test('creates skills and approvals, then approves and rejects them', () => {
    const repo = new SessionMutationRepository('reviewer-1');
    const created = repo.addSkill({
      associateId: '6100001',
      skill_code: 'TS',
      title: 'TypeScript',
      description: 'Typed JavaScript',
      expertise: 'advanced',
      years_of_experience: 5,
      last_used: '2026-11-24',
      idempotencyKey: 'skill-1',
    });
    expect(created.approval.reviewer_id).toBe('reviewer-1');
    expect(created.skill.approval_status).toBe('pending');

    expect(() =>
      repo.patchSkill({
        associateId: '6100001',
        skillId: created.skill.skill_id,
        skill_code: 'TS',
        title: 'TypeScript',
        description: 'Typed JavaScript',
        expertise: 'advanced',
        years_of_experience: 6,
        last_used: '2026-11-24',
        expected_version: 1,
      }),
    ).toThrow(ConflictError);
    expect(() =>
      repo.patchSkill({
        associateId: '6100001',
        skillId: 'missing-skill',
        skill_code: 'TS',
        title: 'TypeScript',
        description: 'Typed JavaScript',
        expertise: 'advanced',
        years_of_experience: 6,
        last_used: '2026-11-24',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);

    const approvedSkill = repo.decideApproval({
      approvalRequestId: created.approval.approval_request_id,
      reviewerId: 'reviewer-1',
      decision: 'approved',
      expected_version: 1,
    });
    expect(approvedSkill.updated_resource).toMatchObject({ approval_status: 'approved' });

    const selfApprovalRepo = new SessionMutationRepository('6100001');
    const selfApprovalRequest = selfApprovalRepo.addSkill({
      associateId: '6100001',
      skill_code: 'K8S',
      title: 'Kubernetes',
      description: 'Containers',
      expertise: 'intermediate',
      years_of_experience: 4,
      last_used: '2026-11-24',
    });
    expect(() =>
      selfApprovalRepo.decideApproval({
        approvalRequestId: selfApprovalRequest.approval.approval_request_id,
        reviewerId: '6100001',
        decision: 'approved',
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    const rejectedSkillRequest = repo.patchSkill({
      associateId: '6100001',
      skillId: created.skill.skill_id,
      skill_code: 'TS',
      title: 'TypeScript',
      description: 'Typed JavaScript',
      expertise: 'advanced',
      years_of_experience: 6,
      last_used: '2026-11-24',
      expected_version: 2,
    });
    const rejectedSkill = repo.decideApproval({
      approvalRequestId: rejectedSkillRequest.approval_request_id,
      reviewerId: 'reviewer-1',
      decision: 'rejected',
      reason: 'not now',
      expected_version: rejectedSkillRequest.version,
    });
    expect(rejectedSkill.approval.status).toBe('rejected');
    expect(() =>
      repo.decideApproval({
        approvalRequestId: rejectedSkillRequest.approval_request_id,
        reviewerId: 'someone-else',
        decision: 'approved',
        expected_version: rejectedSkillRequest.version,
      }),
    ).toThrow(ConflictError);
    const missingReasonRequest = repo.patchSkill({
      associateId: '6100001',
      skillId: created.skill.skill_id,
      skill_code: 'TS',
      title: 'TypeScript',
      description: 'Typed JavaScript',
      expertise: 'advanced',
      years_of_experience: 6,
      last_used: '2026-11-24',
      expected_version: 3,
    });
    expect(() =>
      repo.decideApproval({
        approvalRequestId: missingReasonRequest.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'rejected',
        expected_version: missingReasonRequest.version,
      }),
    ).toThrow(ConflictError);

    const progress = repo.patchProgress({
      associateId: '6100001',
      learningAssignmentId: 'assignment-1',
      status_percentage: 100,
      certificate_file_id: null,
      expected_version: 1,
      idempotencyKey: 'progress-1',
    });
    expect(progress.reviewer_id).toBe('reviewer-1');
    expect(() =>
      repo.patchProgress({
        associateId: '6100001',
        learningAssignmentId: 'assignment-1',
        status_percentage: 0,
        certificate_file_id: null,
        expected_version: 1,
      }),
    ).toThrow(ConflictError);
    expect(() =>
      repo.patchProgress({
        associateId: '6100001',
        learningAssignmentId: 'missing-assignment',
        status_percentage: 10,
        certificate_file_id: null,
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);
    expect(() =>
      repo.patchProgress({
        associateId: '6100004',
        learningAssignmentId: 'assignment-1',
        status_percentage: 10,
        certificate_file_id: null,
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    const decision = repo.decideApproval({
      approvalRequestId: progress.approval_request_id,
      reviewerId: 'reviewer-1',
      decision: 'approved',
      expected_version: 1,
      idempotencyKey: 'decision-1',
    });
    expect(decision.updated_resource).toMatchObject({ status: 'completed', status_percentage: 100 });
    const rejectedProgress = repo.decideApproval({
      approvalRequestId: progress.approval_request_id,
      reviewerId: 'reviewer-1',
      decision: 'rejected',
      reason: 'hold',
      expected_version: decision.approval.version,
    });
    expect(rejectedProgress.approval.status).toBe('rejected');

    expect(() =>
      repo.decideApproval({
        approvalRequestId: progress.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'rejected',
        reason: 'not now',
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    expect(() =>
      repo.decideApproval({
        approvalRequestId: 'missing',
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);
  });

  test('assigns learning, patches roles and registers files', () => {
    const repo = new SessionMutationRepository('reviewer-1');
    const assignment = repo.assignLearning({
      associateId: '6100004',
      learning_code: 'LEARN-2',
      subject: 'Coaching',
      date_due: '2026-12-31',
      assigned_by: '6100001',
      idempotencyKey: 'assign-1',
    });
    expect(assignment.associate_id).toBe('6100004');
    expect(() =>
      repo.assignLearning({
        associateId: '6100004',
        learning_code: 'LEARN-2',
        subject: 'Duplicate',
        date_due: '2026-12-31',
        assigned_by: '6100001',
      }),
    ).toThrow(ConflictError);
    expect(() =>
      repo.assignLearning({
        associateId: '6100004',
        learning_code: 'LEARN-3',
        subject: 'Blocked',
        date_due: '2026-12-31',
        assigned_by: 'wrong-manager',
      }),
    ).toThrow(ConflictError);

    const roles = repo.patchRoles({
      associateId: '6100001',
      application_roles: ['associate', 'admin'],
      expected_version: 1,
      idempotencyKey: 'roles-1',
    });
    expect(roles.application_roles).toEqual(['associate', 'admin']);
    expect(() =>
      repo.patchRoles({
        associateId: '6100001',
        application_roles: ['associate'],
        expected_version: 2,
      }),
    ).toThrow(ConflictError);

    const quietRepo = new SessionMutationRepository('reviewer-1');
    const promoted = quietRepo.patchRoles({
      associateId: '7777777',
      application_roles: ['associate', 'manager'],
      expected_version: 0,
    });
    expect(promoted.application_roles).toEqual(['associate', 'manager']);
    expect(
      quietRepo.patchRoles({
        associateId: '7777777',
        application_roles: ['associate'],
        expected_version: 1,
      }).application_roles,
    ).toEqual(['associate']);

    const selfReassignRepo = new SessionMutationRepository('6100001');
    expect(() =>
      selfReassignRepo.patchRoles({
        associateId: '6100001',
        application_roles: ['associate', 'admin'],
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    const file = repo.registerFile({
      purpose: 'cv',
      name: 'cv.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1024,
      idempotencyKey: 'file-1',
    });
    expect(file.file_id).toMatch(/^file-/);
  });

  test('covers remaining branches and defaults', () => {
    const repo = new SessionMutationRepository('reviewer-1');

    const missingProfile = repo.patchProfile({
      associateId: 'new-associate',
      name: 'New Hire',
      phone: '555-0000',
      address: 'New Address',
      avatar_file_id: null,
      cv_file_id: null,
      expected_version: 0,
    });
    expect(missingProfile.associate_id).toBe('new-associate');

    const reviewedSkill = repo.addSkill({
      associateId: '6100004',
      skill_code: 'NODE',
      title: 'Node.js',
      description: 'Runtime',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    expect(reviewedSkill.approval.reviewer_id).toBe('6100001');

    expect(() =>
      repo.patchRoles({
        associateId: '6100001',
        application_roles: [],
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    const skillApproval = repo.addSkill({
      associateId: '6100001',
      skill_code: 'PY',
      title: 'Python',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    (repo as unknown as { approvals: Map<string, unknown> }).approvals.set(skillApproval.approval.approval_request_id, {
      ...skillApproval.approval,
      skill_id: 'missing-skill',
    });
    expect(() =>
      repo.decideApproval({
        approvalRequestId: skillApproval.approval.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);

    const certificate = repo.registerFile({
      purpose: 'certificate',
      name: 'cert.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1,
    });
    const skillWithEvidence = repo.addSkill({
      associateId: '6100001',
      skill_code: 'TS',
      title: 'TypeScript',
      description: 'Language',
      expertise: 'intermediate',
      years_of_experience: 3,
      last_used: '2026-11-24',
      evidence_file_id: certificate.file_id,
    });
    expect(skillWithEvidence.skill.evidence?.file_id).toBe(certificate.file_id);

    const rejectedSkill = repo.addSkill({
      associateId: '6100001',
      skill_code: 'RB',
      title: 'Ruby',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    expect(
      repo.decideApproval({
        approvalRequestId: rejectedSkill.approval.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'rejected',
        reason: 'Not needed',
        expected_version: 1,
      }).updated_resource,
    ).toBeNull();

    expect(() =>
      repo.patchSkill({
        associateId: '6100001',
        skillId: 'missing-skill',
        skill_code: 'TS',
        title: 'TypeScript',
        description: 'Language',
        expertise: 'intermediate',
        years_of_experience: 3,
        last_used: '2026-11-24',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);

    const progressApproval = repo.patchProgress({
      associateId: '6100001',
      learningAssignmentId: 'assignment-1',
      status_percentage: 100,
      certificate_file_id: certificate.file_id,
      expected_version: 1,
    });
    expect(progressApproval.proposed_percentage).toBe(100);

    const topReviewerRepo = new SessionMutationRepository('6100001');
    expect(() =>
      topReviewerRepo.patchRoles({
        associateId: '6100001',
        application_roles: ['associate'],
        expected_version: 1,
      }),
    ).toThrow(ConflictError);
  });

  test('covers constructor defaults and progress approvals', () => {
    const defaultRepo = new SessionMutationRepository();
    expect(defaultRepo).toBeInstanceOf(SessionMutationRepository);

    const repo = new SessionMutationRepository('reviewer-1');
    const skill = repo.addSkill({
      associateId: '6100001',
      skill_code: 'GO',
      title: 'Go',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    (repo as unknown as { approvals: Map<string, unknown> }).approvals.delete(skill.approval.approval_request_id);
    expect(() =>
      repo.patchSkill({
        associateId: '6100001',
        skillId: skill.skill.skill_id,
        skill_code: 'GO',
        title: 'Go',
        description: 'Language',
        expertise: 'intermediate',
        years_of_experience: 2,
        last_used: '2026-11-24',
      }),
    ).not.toThrow();

    const progressRepo = new SessionMutationRepository('reviewer-1');
    progressRepo.assignLearning({
      associateId: '6100001',
      learningActivityId: 'learning-1',
      expected_version: 1,
    });
    const progressAssignmentId = Array.from((progressRepo as unknown as { assignments: Map<string, unknown> }).assignments.keys()).at(-1);
    const progress50 = progressRepo.patchProgress({
      associateId: '6100001',
      learningAssignmentId: progressAssignmentId as string,
      status_percentage: 50,
      certificate_file_id: null,
      expected_version: 1,
    });
    const progress50ApprovalId = Array.from((progressRepo as unknown as { approvals: Map<string, unknown> }).approvals.keys()).at(-1);
    expect(
      progressRepo.decideApproval({
        approvalRequestId: progress50ApprovalId as string,
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }).updated_resource,
    ).not.toBeNull();

    const progressRepo2 = new SessionMutationRepository('reviewer-1');
    progressRepo2.assignLearning({
      associateId: '6100001',
      learningActivityId: 'learning-2',
      expected_version: 1,
    });
    const progressAssignmentId2 = Array.from((progressRepo2 as unknown as { assignments: Map<string, unknown> }).assignments.keys()).at(-1);
    const progress100 = progressRepo2.patchProgress({
      associateId: '6100001',
      learningAssignmentId: progressAssignmentId2 as string,
      status_percentage: 100,
      certificate_file_id: null,
      expected_version: 1,
    });
    const progress100ApprovalId = Array.from((progressRepo2 as unknown as { approvals: Map<string, unknown> }).approvals.keys()).at(-1);
    expect(
      progressRepo2.decideApproval({
        approvalRequestId: progress100ApprovalId as string,
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }).updated_resource?.status_percentage,
    ).toBe(100);
  });

  test('covers evidence, approval, and role-reassignment branches', () => {
    const repo = new SessionMutationRepository('reviewer-1');
    const file = repo.registerFile({
      purpose: 'certificate',
      name: 'evidence.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1,
    });

    const skillWithEvidence = repo.addSkill({
      associateId: '6100001',
      skill_code: 'TS',
      title: 'TypeScript',
      description: 'Language',
      expertise: 'intermediate',
      years_of_experience: 3,
      last_used: '2026-11-24',
      evidence_file_id: file.file_id,
    });
    expect(skillWithEvidence.skill.evidence?.file_id).toBe(file.file_id);
    const skillApprovalId = Array.from((repo as unknown as { approvals: Map<string, unknown> }).approvals.keys()).at(-1);
    if (skillApprovalId) {
      expect(() =>
        repo.decideApproval({
          approvalRequestId: skillApprovalId,
          reviewerId: 'reviewer-1',
          decision: 'approved',
          expected_version: 1,
        }),
      ).not.toThrow();
    }

    const skillWithoutEvidence = repo.addSkill({
      associateId: '6100001',
      skill_code: 'JS',
      title: 'JavaScript',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
      evidence_file_id: null,
    });
    expect(skillWithoutEvidence.skill.evidence).toBeNull();
    const pendingSkillApprovalId = Array.from((repo as unknown as { approvals: Map<string, unknown> }).approvals.keys()).at(-1);
    if (pendingSkillApprovalId) {
      (repo as unknown as { approvals: Map<string, unknown> }).approvals.delete(pendingSkillApprovalId);
    }

    expect(() =>
      repo.patchSkill({
        associateId: '6100001',
        skillId: skillWithoutEvidence.skill.skill_id,
        skill_code: 'JS',
        title: 'JavaScript',
        description: 'Language',
        expertise: 'intermediate',
        years_of_experience: 2,
        last_used: '2026-11-24',
        evidence_file_id: null,
        expected_version: skillWithoutEvidence.skill.version,
      }),
    ).not.toThrow();

    const progressRepo = new SessionMutationRepository('reviewer-1');
    progressRepo.assignLearning({
      associateId: '6100001',
      learningActivityId: 'learning-1',
      expected_version: 1,
    });
    const progress50 = progressRepo.patchProgress({
      associateId: '6100001',
      learningAssignmentId: Array.from((progressRepo as unknown as { assignments: Map<string, unknown> }).assignments.keys()).at(-1) as string,
      status_percentage: 50,
      certificate_file_id: null,
      expected_version: 1,
    });
    const progress50ApprovalId = progress50.approval_request_id;
    expect(() =>
      progressRepo.decideApproval({
        approvalRequestId: progress50ApprovalId,
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }),
    ).not.toThrow();

    const progressRepo2 = new SessionMutationRepository('reviewer-1');
    progressRepo2.assignLearning({
      associateId: '6100001',
      learningActivityId: 'learning-2',
      expected_version: 1,
    });
    const progress100 = progressRepo2.patchProgress({
      associateId: '6100001',
      learningAssignmentId: Array.from((progressRepo2 as unknown as { assignments: Map<string, unknown> }).assignments.keys()).at(-1) as string,
      status_percentage: 100,
      certificate_file_id: file.file_id,
      expected_version: 1,
    });
    const progress100ApprovalId = progress100.approval_request_id;
    expect(() =>
      progressRepo2.decideApproval({
        approvalRequestId: progress100ApprovalId,
        reviewerId: 'reviewer-1',
        decision: 'approved',
        expected_version: 1,
      }),
    ).not.toThrow();

    expect(() =>
      repo.patchRoles({
        associateId: '6100001',
        application_roles: ['admin'],
        expected_version: 1,
      }),
    ).not.toThrow();
  });

  test('covers remaining mutation edge branches', () => {
    const defaultRepo = new SessionMutationRepository();
    expect(defaultRepo).toBeInstanceOf(SessionMutationRepository);

    const missingEvidenceRepo = new SessionMutationRepository('reviewer-1');
    const missingEvidenceSkill = missingEvidenceRepo.addSkill({
      associateId: '6100001',
      skill_code: 'ML',
      title: 'Machine Learning',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
      evidence_file_id: 'missing-file',
    });
    expect(missingEvidenceSkill.skill.evidence).toBeNull();

    const duplicatePendingRepo = new SessionMutationRepository('reviewer-1');
    const duplicatePendingSkill = duplicatePendingRepo.addSkill({
      associateId: '6100001',
      skill_code: 'DP',
      title: 'Duplicate Pending',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    expect(() =>
      duplicatePendingRepo.patchSkill({
        associateId: '6100001',
        skillId: duplicatePendingSkill.skill.skill_id,
        skill_code: 'DP',
        title: 'Duplicate Pending',
        description: 'Language',
        expertise: 'intermediate',
        years_of_experience: 2,
        last_used: '2026-11-24',
        expected_version: 1,
      }),
    ).toThrow(ConflictError);

    const noSkillsRepo = new SessionMutationRepository('reviewer-1');
    expect(() =>
      noSkillsRepo.patchSkill({
        associateId: 'no-skills',
        skillId: 'missing-skill',
        skill_code: 'NS',
        title: 'No Skills',
        description: 'Language',
        expertise: 'beginner',
        years_of_experience: 1,
        last_used: '2026-11-24',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);

    const rejectRepo = new SessionMutationRepository('reviewer-1');
    const rejectedSkill = rejectRepo.addSkill({
      associateId: '6100001',
      skill_code: 'RJ',
      title: 'Reject Me',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    expect(
      rejectRepo.decideApproval({
        approvalRequestId: rejectedSkill.approval.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'rejected',
        reason: 'not needed',
        expected_version: 1,
      }).approval.status,
    ).toBe('rejected');

    const missingSkillListRepo = new SessionMutationRepository('reviewer-1');
    const missingSkillList = missingSkillListRepo.addSkill({
      associateId: '6100001',
      skill_code: 'ML2',
      title: 'Missing Skill List',
      description: 'Language',
      expertise: 'beginner',
      years_of_experience: 1,
      last_used: '2026-11-24',
    });
    (missingSkillListRepo as unknown as { skills: Map<string, unknown> }).skills.delete('6100001');
    expect(() =>
      missingSkillListRepo.decideApproval({
        approvalRequestId: missingSkillList.approval.approval_request_id,
        reviewerId: 'reviewer-1',
        decision: 'rejected',
        reason: 'not needed',
        expected_version: 1,
      }),
    ).toThrow(NotFoundError);

    const rolesRepo = new SessionMutationRepository('reviewer-1');
    rolesRepo.patchRoles({
      associateId: '7777777',
      application_roles: ['associate', 'admin'],
      expected_version: 0,
    });
    expect(() =>
      rolesRepo.patchRoles({
        associateId: '6100001',
        application_roles: ['associate', 'manager'],
        expected_version: 1,
      }),
    ).not.toThrow();

    const undefinedVersionRepo = new SessionMutationRepository('reviewer-1');
    (undefinedVersionRepo as unknown as { adminUsers: Map<string, unknown> }).adminUsers.set('undefined-version', {
      auth_user_id: 'dummy-user-undefined-version',
      associate_id: 'undefined-version',
      application_roles: ['associate', 'admin', 'manager'],
      associate_name: '',
      associate_email: '',
      version: undefined,
    });
    expect(() =>
      undefinedVersionRepo.patchRoles({
        associateId: 'undefined-version',
        application_roles: ['associate', 'admin', 'manager'],
        expected_version: 0,
      }),
    ).not.toThrow();
  });
});
