import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  AdminClient,
  AssociateClient,
  AuthManager,
  CompanySsoAuthStrategy,
  ConfigManager,
  CredentialsAuthStrategy,
  AuthenticatedTransport,
  FakeRefreshProvider,
  InsecureDevTransport,
  LearningClient,
  JsonTransport,
  MutationQueue,
  SessionMutationRepository,
  SkillClient,
  TeamClient,
  ValidationError,
  type AdminUser,
  type Associate,
  type AssociateSkill,
  type Biometrics,
  type AuthSession,
  type CredentialsAuthInput,
  type Learning,
  type LearningAssignment,
  type Page,
  type Profile,
  type SecureStorage,
  type RuntimeConfig,
} from '@cts-talent/sdk';
import { LocalAuthBiometrics, SecureStoreAdapter } from '@cts-talent/sdk/react-native';

import { bundledBootstrap } from '../config/bundledBootstrap';
import runtimeConfigSeed from '../config/runtimeConfig.local.json';
import {
  createInitialProfileDraft,
  createInitialWorkspaceDraft,
  normalizeRoles,
  type ApprovalItem,
  type ProfileDraft,
  type SkillDraft,
  type WorkspaceDraft,
} from '../state/sessionStore';

export const APP_REFRESH_KEY = 'cts-talent.refresh-token';

export type WorkspaceData = {
  profile: ProfileDraft;
  skills: SkillDraft[];
  assignments: LearningAssignment[];
  approvals: ApprovalItem[];
  team: Associate[];
  users: AdminUser[];
  learnings: Learning[];
  me?: Associate;
};

export type AppServices = {
  runtimeConfig: RuntimeConfig;
  bootstrapConfig: RuntimeConfig;
  configManager: ConfigManager;
  transport: JsonTransport;
  authenticatedTransport: JsonTransport;
  storage: SecureStorage;
  biometrics: Biometrics;
  authManager: AuthManager;
  credentialsStrategy: CredentialsAuthStrategy;
  ssoStrategy: CompanySsoAuthStrategy;
  refreshProvider: FakeRefreshProvider;
  sessionMutationRepository: SessionMutationRepository;
  mutationQueue: MutationQueue;
  associateClient: AssociateClient;
  skillClient: SkillClient;
  learningClient: LearningClient;
  teamClient: TeamClient;
  adminClient: AdminClient;
  portal: {
    queueCredentials(credentials: CredentialsAuthInput): void;
    clearQueuedCredentials(): void;
    signIn(): Promise<CredentialsAuthInput>;
  };
  bootstrap(): Promise<RuntimeConfig>;
  authenticateWithCredentials(credentials: CredentialsAuthInput): Promise<AuthSession>;
  authenticateWithPortal(): Promise<AuthSession>;
  restoreSession(): Promise<AuthSession | null>;
  logout(): Promise<void>;
  persistDemoRefreshToken(session: AuthSession): Promise<void>;
  loadWorkspace(): Promise<WorkspaceData>;
  saveProfile(profile: ProfileDraft): Promise<Profile>;
  saveSkill(associateId: string, skill: SkillDraft): Promise<{ skill: AssociateSkill; approval: unknown }>;
  saveProgress(associateId: string, learningAssignmentId: string, statusPercentage: number): Promise<unknown>;
  assignLearning(input: {
    associateId: string;
    learningCode: string;
    subject: string;
    dueDate: string;
    instructions?: string;
    assignedBy: string;
  }): Promise<LearningAssignment>;
  patchRoles(input: { associateId: string; applicationRoles: AppServicesRole[] }): Promise<AdminUser>;
  buildFallbackWorkspace(): WorkspaceData;
};

export type AppServicesRole = 'associate' | 'manager' | 'admin';

type FetchLike = typeof fetch;

class TrackedSecureStorage implements SecureStorage {
  private readonly keys = new Set<string>();

  constructor(private readonly inner: SecureStorage) {}

  async getItem(key: string): Promise<string | null> {
    return this.inner.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    this.keys.add(key);
    await this.inner.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.keys.delete(key);
    await this.inner.removeItem(key);
  }

  async clear(): Promise<void> {
    await Promise.all([...this.keys].map((key) => this.inner.removeItem(key)));
    this.keys.clear();
  }
}

function toPage<T>(items: T[]): Page<T> {
  return {
    items,
    total: items.length,
    limit: items.length,
    offset: 0,
    next_offset: null,
  };
}

function toProfileDraft(profile?: Associate | Profile): ProfileDraft {
  if (!profile) {
    return createInitialProfileDraft();
  }
  if ('associate_email' in profile) {
    return {
      associateId: profile.associate_id,
      email: profile.associate_email,
      name: profile.associate_name,
      phone: '555-0100',
      address: '1 Talent Way',
      avatar_file_id: null,
      cv_file_id: null,
    };
  }
  return {
    associateId: profile.associate_id,
    email: 'alex.morgan@example.com',
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    avatar_file_id: profile.avatar_file_id,
    cv_file_id: profile.cv_file_id,
  };
}

function toSkillDraft(skill: AssociateSkill): SkillDraft {
  return {
    skill_code: skill.skill_code,
    title: skill.title,
    description: skill.description,
    expertise: skill.expertise,
    years_of_experience: skill.years_of_experience,
    last_used: skill.last_used,
  };
}

function createFallbackWorkspace(config: RuntimeConfig): WorkspaceData {
  const profile = createInitialProfileDraft(config.topLevelReviewerAssociateId);
  profile.name = 'Alex Morgan';
  profile.email = 'alex.morgan@example.com';
  const skills: SkillDraft[] = [
    {
      skill_code: 'AWS-1',
      title: 'AWS',
      description: 'Cloud fundamentals',
      expertise: 'intermediate',
      years_of_experience: 2,
      last_used: '2026-11-01',
    },
  ];
  return {
    profile,
    skills,
    assignments: [
      {
        learning_assignment_id: 'assignment-1',
        associate_id: profile.associateId,
        learning_code: 'LEARN-1',
        subject: 'Learning basics',
        date_assigned: '2026-11-20',
        date_due: '2026-12-01',
        status: 'not_started',
        status_percentage: 0,
        description: 'Seed assignment',
        certificate_required: false,
        certificate: null,
        assigned_by: config.topLevelReviewerAssociateId,
        date_completed: null,
      },
    ],
    approvals: createInitialWorkspaceDraft(config.topLevelReviewerAssociateId).approvals,
    team: [
      {
        associate_id: '6100001',
        auth_user_id: 'dummy-user-6100001',
        associate_name: 'Alex Morgan',
        associate_email: 'alex.morgan@example.com',
        associate_group: 'Engineering',
        associate_role: 'Associate Consultant',
        date_join: '2024-01-01',
        associate_manager: config.topLevelReviewerAssociateId,
        associate_direct_reports: ['6100004'],
        location: 'Remote',
        skills: [],
        associate_status: { status: 'on_bench', unassigned_start_date: '2026-11-01' },
        learning_assignments: ['assignment-1'],
        is_active: true,
        date_leave: null,
        created_at: '2026-11-01T00:00:00Z',
        updated_at: '2026-11-23T00:00:00Z',
      },
    ],
    users: [
      {
        auth_user_id: 'dummy-user-6100001',
        associate_id: '6100001',
        application_roles: ['associate', 'manager', 'admin'],
        associate_name: 'Alex Morgan',
        associate_email: 'alex.morgan@example.com',
        version: 1,
      },
    ],
    learnings: [
      {
        learning_code: 'LEARN-1',
        subject: 'Learning basics',
        seniority_level: 'any',
        target_associate_roles: ['associate'],
        skills: ['AWS-1'],
        description: 'Starter content',
        estimated_hours: 4,
        certificate_required: false,
        is_active: true,
      },
    ],
    me: undefined,
  };
}

function createAuthStorage(storage?: SecureStorage): SecureStorage {
  if (storage) {
    return storage;
  }
  return new TrackedSecureStorage(
    new SecureStoreAdapter({
      getItemAsync: SecureStore.getItemAsync,
      setItemAsync: SecureStore.setItemAsync,
      deleteItemAsync: SecureStore.deleteItemAsync,
    }),
  );
}

function createBiometrics(biometrics?: Biometrics): Biometrics {
  if (biometrics) {
    return biometrics;
  }
  return new LocalAuthBiometrics({
    hasHardwareAsync: LocalAuthentication.hasHardwareAsync,
    isEnrolledAsync: LocalAuthentication.isEnrolledAsync,
    authenticateAsync: LocalAuthentication.authenticateAsync,
    cancelAuthenticate: LocalAuthentication.cancelAuthenticate,
  });
}

export function createAppServices(options: {
  fetchImpl?: FetchLike;
  storage?: SecureStorage;
  biometrics?: Biometrics;
  runtimeConfig?: RuntimeConfig;
} = {}): AppServices {
  const runtimeConfig = options.runtimeConfig ?? (runtimeConfigSeed as RuntimeConfig);
  const configManager = new ConfigManager({
    minimumAppBuild: runtimeConfig.minimumAppBuild,
    defaultTopLevelReviewerAssociateId: bundledBootstrap.topLevelReviewerAssociateId,
    allowlistedHosts: [...bundledBootstrap.allowlistedHosts],
  });
  const bootstrapConfig = configManager.validate(runtimeConfig).config;
  const storage = createAuthStorage(options.storage);
  const biometrics = createBiometrics(options.biometrics);
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseTransport = new JsonTransport(
    bundledBootstrap.apiBaseUrl ?? 'http://127.0.0.1:3001',
    fetchImpl,
    bootstrapConfig.api.timeoutMs,
  );
  const devTransport = new InsecureDevTransport(
    bundledBootstrap.apiBaseUrl ?? 'http://127.0.0.1:3001',
    fetchImpl,
    bootstrapConfig.api.timeoutMs,
  );
  void devTransport;

  const sessionMutationRepository = new SessionMutationRepository(bootstrapConfig.topLevelReviewerAssociateId);
  const mutationQueue = new MutationQueue(sessionMutationRepository);
  const portalState: { queued: CredentialsAuthInput | null } = { queued: null };
  const credentialsStrategy = new CredentialsAuthStrategy(baseTransport, {
    pathPrefix: bootstrapConfig.api.pathPrefix,
  });
  const ssoStrategy = new CompanySsoAuthStrategy(
    {
      async signIn() {
        if (!portalState.queued) {
          throw new ValidationError('Portal credentials are required');
        }
        const credentials = portalState.queued;
        portalState.queued = null;
        return credentials;
      },
    },
    credentialsStrategy,
  );
  const refreshProvider = new FakeRefreshProvider();
  const authManager = new AuthManager({
    storage,
    biometrics,
    credentialsStrategy,
    ssoStrategy,
    refreshProvider: {
      refresh(refreshToken: string) {
        return refreshProvider.refresh(refreshToken);
      },
    },
    refreshKey: APP_REFRESH_KEY,
  });
  const authenticatedTransport = new AuthenticatedTransport(baseTransport, authManager, authManager);
  const transport = authenticatedTransport as unknown as JsonTransport;
  const associateClient = new AssociateClient(transport);
  const skillClient = new SkillClient(transport);
  const learningClient = new LearningClient(transport);
  const teamClient = new TeamClient(transport);
  const adminClient = new AdminClient(transport);

  return {
    runtimeConfig,
    bootstrapConfig,
    configManager,
    transport: baseTransport,
    authenticatedTransport: authenticatedTransport as unknown as JsonTransport,
    storage,
    biometrics,
    authManager,
    credentialsStrategy,
    ssoStrategy,
    refreshProvider,
    sessionMutationRepository,
    mutationQueue,
    associateClient,
    skillClient,
    learningClient,
    teamClient,
    adminClient,
    portal: {
      queueCredentials(credentials: CredentialsAuthInput) {
        portalState.queued = credentials;
      },
      clearQueuedCredentials() {
        portalState.queued = null;
      },
      async signIn() {
        if (!portalState.queued) {
          throw new ValidationError('Portal credentials are required');
        }
        return portalState.queued;
      },
    },
    async bootstrap() {
      return bootstrapConfig;
    },
    async authenticateWithCredentials(credentials: CredentialsAuthInput) {
      const session = await authManager.authenticate({ strategy: 'credentials', ...credentials });
      if (!session) {
        throw new ValidationError('Credentials authentication failed');
      }
      await storage.setItem(APP_REFRESH_KEY, `demo-${credentials.associateId}`);
      return session;
    },
    async authenticateWithPortal() {
      const session = await authManager.authenticate({ strategy: 'sso' });
      if (!session) {
        throw new ValidationError('SSO authentication failed');
      }
      await storage.setItem(APP_REFRESH_KEY, `demo-${session.identity.associate_id}`);
      return session;
    },
    async restoreSession() {
      return authManager.authenticate();
    },
    async logout() {
      await mutationQueue.purgeAll();
      await authManager.logout();
      await storage.clear();
    },
    async persistDemoRefreshToken(session: AuthSession) {
      await storage.setItem(APP_REFRESH_KEY, `demo-${session.identity.associate_id}`);
    },
    async loadWorkspace() {
      const fallback = createFallbackWorkspace(bootstrapConfig);
      try {
        const [me, profile, skills, assignments, team, users, learnings] = await Promise.all([
          associateClient.getMe(),
          associateClient.getMeProfile(),
          associateClient.listMeSkills({ limit: bootstrapConfig.api.pageSize }),
          learningClient.listMyAssignments({ limit: bootstrapConfig.api.pageSize }),
          teamClient.getTeam({ limit: bootstrapConfig.api.pageSize }),
          adminClient.listUsers({ limit: bootstrapConfig.api.pageSize }),
          skillClient.listLearnings({ limit: bootstrapConfig.api.pageSize }),
        ]);
        return {
          profile: toProfileDraft(profile ?? me),
          skills: skills.items.map(toSkillDraft),
          assignments: assignments.items,
          approvals: fallback.approvals,
          team: team.items,
          users: users.items.map((user) => ({ ...user, application_roles: normalizeRoles(user.application_roles) })),
          learnings: learnings.items,
          me,
        };
      } catch {
        return fallback;
      }
    },
    async saveProfile(profile: ProfileDraft) {
      return sessionMutationRepository.patchProfile({
        associateId: profile.associateId,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        avatar_file_id: profile.avatar_file_id,
        cv_file_id: profile.cv_file_id,
        expected_version: 1,
      });
    },
    async saveSkill(associateId: string, skill: SkillDraft) {
      return sessionMutationRepository.addSkill({
        associateId,
        skill_code: skill.skill_code,
        title: skill.title,
        description: skill.description,
        expertise: skill.expertise,
        years_of_experience: skill.years_of_experience,
        last_used: skill.last_used,
      });
    },
    async saveProgress(associateId: string, learningAssignmentId: string, statusPercentage: number) {
      return sessionMutationRepository.patchProgress({
        associateId,
        learningAssignmentId,
        status_percentage: statusPercentage,
        expected_version: 1,
      });
    },
    async assignLearning(input) {
      return sessionMutationRepository.assignLearning({
        associateId: input.associateId,
        learning_code: input.learningCode,
        subject: input.subject,
        date_due: input.dueDate,
        instructions: input.instructions,
        assigned_by: input.assignedBy,
      });
    },
    async patchRoles(input) {
      return sessionMutationRepository.patchRoles({
        associateId: input.associateId,
        application_roles: input.applicationRoles,
        expected_version: 1,
      });
    },
    buildFallbackWorkspace() {
      return createFallbackWorkspace(bootstrapConfig);
    },
  };
}

