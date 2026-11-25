import type {
  AdminUser,
  ApplicationRole,
  Associate,
  AssociateSkill,
  AuthSession,
  Learning,
  LearningAssignment,
  Profile,
  RuntimeConfig,
} from '@cts-talent/sdk';

export type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error';
export type OnboardingStep = 'personal' | 'skills' | 'cv';

export type ProfileDraft = Pick<Profile, 'name' | 'phone' | 'address' | 'avatar_file_id' | 'cv_file_id'> & {
  email: string;
  associateId: string;
};

export type SkillDraft = Pick<
  AssociateSkill,
  'skill_code' | 'title' | 'description' | 'expertise' | 'years_of_experience' | 'last_used'
>;

export type CvDraft = {
  fileName: string;
  summary: string;
  paused: boolean;
};

export type ApprovalItem = {
  approvalRequestId: string;
  requestType: 'skill' | 'progress';
  title: string;
  detail: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  associateId: string;
};

export interface WorkspaceDraft {
  profile: ProfileDraft;
  skills: SkillDraft[];
  cv: CvDraft;
  assignments: LearningAssignment[];
  learnings: Learning[];
  approvals: ApprovalItem[];
  team: Associate[];
  users: AdminUser[];
  activeRoleTab: ApplicationRole;
  drawerOpen: boolean;
  teamQuery: string;
  userQuery: string;
  rejectionReason: string;
  learningCode: string;
  learningSubject: string;
  learningDueDate: string;
  learningAssigneeId: string;
}

export interface AppSessionState {
  bootstrap: {
    status: BootstrapStatus;
    error?: string;
    config?: RuntimeConfig;
  };
  auth: {
    session: AuthSession | null;
    restored: boolean;
    error?: string;
  };
  activation: {
    email: string;
    associateId: string;
  };
  onboarding: {
    step: OnboardingStep;
    completed: boolean;
    draftPaused: boolean;
    profile: ProfileDraft;
    skills: SkillDraft[];
    cv: CvDraft;
    learnings: Learning[];
  };
  workspace: WorkspaceDraft;
}

export function createInitialProfileDraft(associateId = '6100001'): ProfileDraft {
  return {
    associateId,
    email: 'alex.morgan@example.com',
    name: 'Alex Morgan',
    phone: '555-0100',
    address: '1 Talent Way',
    avatar_file_id: null,
    cv_file_id: null,
  };
}

export function createInitialWorkspaceDraft(reviewerId = 'top-reviewer'): WorkspaceDraft {
  return {
    profile: createInitialProfileDraft(),
    skills: [],
    cv: {
      fileName: 'alex-morgan-cv.pdf',
      summary: 'Learning draft paused in memory.',
      paused: false,
    },
    assignments: [],
    learnings: [],
    approvals: [
      {
        approvalRequestId: 'approval-skill-1',
        requestType: 'skill',
        title: 'AWS skill update',
        detail: 'Alex submitted an AWS skill evidence update.',
        reason: '',
        status: 'pending',
        associateId: '6100001',
      },
      {
        approvalRequestId: 'approval-progress-1',
        requestType: 'progress',
        title: 'Learning progress',
        detail: 'Review completion progress for a learning assignment.',
        reason: '',
        status: 'pending',
        associateId: '6100004',
      },
    ],
    team: [],
    users: [],
    activeRoleTab: 'associate',
    drawerOpen: false,
    teamQuery: '',
    userQuery: '',
    rejectionReason: '',
    learningCode: 'LEARN-1',
    learningSubject: 'Learning basics',
    learningDueDate: '2026-12-15',
    learningAssigneeId: reviewerId,
  };
}

export function createInitialSessionState(): AppSessionState {
  return {
    bootstrap: { status: 'idle' },
    auth: { session: null, restored: false },
    activation: {
      email: '',
      associateId: '',
    },
    onboarding: {
      step: 'personal',
      completed: false,
      draftPaused: false,
      profile: createInitialProfileDraft(),
      skills: [],
      cv: {
        fileName: '',
        summary: '',
        paused: false,
      },
      learnings: [],
    },
    workspace: createInitialWorkspaceDraft(),
  };
}

export function normalizeRoles(roles: ApplicationRole[]): ApplicationRole[] {
  return [...new Set(roles)];
}

