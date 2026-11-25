import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ApplicationRole, AuthSession } from '@cts-talent/sdk';

import { createAppServices, type AppServices, type WorkspaceData } from './createAppServices';
import {
  createInitialSessionState,
  createInitialProfileDraft,
  type AppSessionState,
  type ApprovalItem,
  type CvDraft,
  type OnboardingStep,
  type ProfileDraft,
  type SkillDraft,
} from '../state/sessionStore';

type AppAction =
  | { type: 'bootstrap/loading' }
  | { type: 'bootstrap/ready'; config: AppSessionState['bootstrap']['config'] }
  | { type: 'bootstrap/error'; error: string }
  | { type: 'auth/set'; session: AuthSession | null; restored: boolean }
  | { type: 'activation/set'; email: string; associateId: string }
  | { type: 'onboarding/step'; step: OnboardingStep }
  | { type: 'onboarding/profile'; profile: ProfileDraft }
  | { type: 'onboarding/skills'; skills: SkillDraft[] }
  | { type: 'onboarding/cv'; cv: CvDraft }
  | { type: 'onboarding/pause'; paused: boolean }
  | { type: 'onboarding/complete'; completed: boolean }
  | { type: 'workspace/load'; workspace: Partial<AppSessionState['workspace']> }
  | { type: 'workspace/profile'; profile: ProfileDraft }
  | { type: 'workspace/skills'; skills: SkillDraft[] }
  | { type: 'workspace/assignments'; assignments: AppSessionState['workspace']['assignments'] }
  | { type: 'workspace/learnings'; learnings: WorkspaceData['learnings'] }
  | { type: 'workspace/approvals'; approvals: ApprovalItem[] }
  | { type: 'workspace/team'; team: WorkspaceData['team'] }
  | { type: 'workspace/users'; users: WorkspaceData['users'] }
  | { type: 'workspace/drawer'; drawerOpen: boolean }
  | { type: 'workspace/role'; role: ApplicationRole }
  | { type: 'workspace/teamQuery'; teamQuery: string }
  | { type: 'workspace/userQuery'; userQuery: string }
  | { type: 'workspace/rejectionReason'; rejectionReason: string }
  | { type: 'workspace/learningCode'; learningCode: string }
  | { type: 'workspace/learningSubject'; learningSubject: string }
  | { type: 'workspace/learningDueDate'; learningDueDate: string }
  | { type: 'workspace/learningAssigneeId'; learningAssigneeId: string };

export interface AppServicesContextValue {
  services: AppServices;
  state: AppSessionState;
  actions: {
    bootstrap(): Promise<void>;
    retryBootstrap(): Promise<void>;
    signInWithCredentials(input: { email: string; associateId: string }): Promise<void>;
    signInWithPortal(input: { email: string; associateId: string }): Promise<void>;
    restoreWithBiometrics(): Promise<AuthSession | null>;
    logout(): Promise<void>;
    queuePortalCredentials(input: { email: string; associateId: string }): void;
    setActivationField(field: 'email' | 'associateId', value: string): void;
    setOnboardingProfile(profile: Partial<ProfileDraft>): void;
    setOnboardingSkills(skills: SkillDraft[]): void;
    addOnboardingSkill(skill: SkillDraft): void;
    setOnboardingCv(cv: Partial<CvDraft>): void;
    setOnboardingStep(step: OnboardingStep): void;
    setOnboardingPaused(paused: boolean): void;
    completeOnboarding(): void;
    setWorkspaceProfile(profile: ProfileDraft): void;
    setWorkspaceSkills(skills: SkillDraft[]): void;
    setWorkspaceAssignments(assignments: AppSessionState['workspace']['assignments']): void;
    setWorkspaceApprovals(approvals: ApprovalItem[]): void;
    setWorkspaceTeam(team: WorkspaceData['team']): void;
    setWorkspaceUsers(users: WorkspaceData['users']): void;
    setWorkspaceLearnings(learnings: WorkspaceData['learnings']): void;
    setDrawerOpen(open: boolean): void;
    setRoleTab(role: ApplicationRole): void;
    setTeamQuery(query: string): void;
    setUserQuery(query: string): void;
    setRejectionReason(reason: string): void;
    setLearningFields(input: { code?: string; subject?: string; dueDate?: string; assigneeId?: string }): void;
    saveProfileDraft(profile: ProfileDraft): Promise<void>;
    addSkill(associateId: string, skill: SkillDraft): Promise<void>;
    saveProgress(associateId: string, learningAssignmentId: string, statusPercentage: number): Promise<void>;
    assignLearning(input: {
      associateId: string;
      learningCode: string;
      subject: string;
      dueDate: string;
      instructions?: string;
      assignedBy: string;
    }): Promise<void>;
    patchRoles(input: { associateId: string; applicationRoles: ApplicationRole[] }): Promise<void>;
    toggleApprovalStatus(approvalRequestId: string, status: ApprovalItem['status']): void;
  };
}

const AppServicesContext = createContext<AppServicesContextValue | null>(null);

function reducer(state: AppSessionState, action: AppAction): AppSessionState {
  switch (action.type) {
    case 'bootstrap/loading':
      return { ...state, bootstrap: { status: 'loading' } };
    case 'bootstrap/ready':
      return { ...state, bootstrap: { status: 'ready', config: action.config } };
    case 'bootstrap/error':
      return { ...state, bootstrap: { status: 'error', error: action.error } };
    case 'auth/set':
      return { ...state, auth: { session: action.session, restored: action.restored, error: undefined } };
    case 'activation/set':
      return { ...state, activation: { email: action.email, associateId: action.associateId } };
    case 'onboarding/step':
      return { ...state, onboarding: { ...state.onboarding, step: action.step } };
    case 'onboarding/profile':
      return { ...state, onboarding: { ...state.onboarding, profile: action.profile } };
    case 'onboarding/skills':
      return { ...state, onboarding: { ...state.onboarding, skills: action.skills } };
    case 'onboarding/cv':
      return { ...state, onboarding: { ...state.onboarding, cv: action.cv } };
    case 'onboarding/pause':
      return { ...state, onboarding: { ...state.onboarding, draftPaused: action.paused } };
    case 'onboarding/complete':
      return { ...state, onboarding: { ...state.onboarding, completed: action.completed } };
    case 'workspace/load':
      return { ...state, workspace: { ...state.workspace, ...action.workspace } };
    case 'workspace/profile':
      return { ...state, workspace: { ...state.workspace, profile: action.profile } };
    case 'workspace/skills':
      return { ...state, workspace: { ...state.workspace, skills: action.skills } };
    case 'workspace/assignments':
      return { ...state, workspace: { ...state.workspace, assignments: action.assignments } };
    case 'workspace/learnings':
      return { ...state, workspace: { ...state.workspace, learnings: action.learnings } };
    case 'workspace/approvals':
      return { ...state, workspace: { ...state.workspace, approvals: action.approvals } };
    case 'workspace/team':
      return { ...state, workspace: { ...state.workspace, team: action.team } };
    case 'workspace/users':
      return { ...state, workspace: { ...state.workspace, users: action.users } };
    case 'workspace/drawer':
      return { ...state, workspace: { ...state.workspace, drawerOpen: action.drawerOpen } };
    case 'workspace/role':
      return { ...state, workspace: { ...state.workspace, activeRoleTab: action.role } };
    case 'workspace/teamQuery':
      return { ...state, workspace: { ...state.workspace, teamQuery: action.teamQuery } };
    case 'workspace/userQuery':
      return { ...state, workspace: { ...state.workspace, userQuery: action.userQuery } };
    case 'workspace/rejectionReason':
      return { ...state, workspace: { ...state.workspace, rejectionReason: action.rejectionReason } };
    case 'workspace/learningCode':
      return { ...state, workspace: { ...state.workspace, learningCode: action.learningCode } };
    case 'workspace/learningSubject':
      return { ...state, workspace: { ...state.workspace, learningSubject: action.learningSubject } };
    case 'workspace/learningDueDate':
      return { ...state, workspace: { ...state.workspace, learningDueDate: action.learningDueDate } };
    case 'workspace/learningAssigneeId':
      return { ...state, workspace: { ...state.workspace, learningAssigneeId: action.learningAssigneeId } };
    default:
      return state;
  }
}

function mergeProfile(profile: ProfileDraft, patch: Partial<ProfileDraft>): ProfileDraft {
  return { ...profile, ...patch };
}

function mergeCv(cv: CvDraft, patch: Partial<CvDraft>): CvDraft {
  return { ...cv, ...patch };
}

export function AppServicesProvider({
  children,
  services = createAppServices(),
}: {
  children: React.ReactNode;
  services?: AppServices;
}) {
  const [state, dispatch] = useReducer(reducer, createInitialSessionState());

  const syncWorkspace = useCallback(async () => {
    const workspace = await services.loadWorkspace();
    dispatch({ type: 'workspace/load', workspace });
    dispatch({ type: 'workspace/profile', profile: workspace.profile });
    dispatch({ type: 'workspace/skills', skills: workspace.skills });
    dispatch({ type: 'workspace/assignments', assignments: workspace.assignments });
    dispatch({ type: 'workspace/learnings', learnings: workspace.learnings });
    dispatch({ type: 'workspace/approvals', approvals: workspace.approvals });
    dispatch({ type: 'workspace/team', team: workspace.team });
    dispatch({ type: 'workspace/users', users: workspace.users });
  }, [services]);

  const bootstrapFlow = useCallback(async () => {
    dispatch({ type: 'bootstrap/loading' });
    try {
      const config = await services.bootstrap();
      dispatch({ type: 'bootstrap/ready', config });
      const restored = await services.restoreSession();
      dispatch({ type: 'auth/set', session: restored, restored: Boolean(restored) });
      if (restored) {
        await syncWorkspace();
        dispatch({ type: 'workspace/role', role: restored.identity.application_roles[0] ?? 'associate' });
        dispatch({ type: 'onboarding/complete', completed: true });
      }
    } catch (error) {
      dispatch({
        type: 'bootstrap/error',
        error: error instanceof Error ? error.message : 'Bootstrap failed',
      });
      throw error;
    }
  }, [services, syncWorkspace]);

  useEffect(() => {
    void bootstrapFlow().catch(() => undefined);
    return undefined;
  }, [bootstrapFlow]);

  const actions = useMemo<AppServicesContextValue['actions']>(
    () => ({
      async bootstrap() {
        await bootstrapFlow();
      },
      async retryBootstrap() {
        await bootstrapFlow();
      },
      async signInWithCredentials(input) {
        const session = await services.authenticateWithCredentials(input);
        dispatch({ type: 'auth/set', session, restored: false });
        await syncWorkspace();
        dispatch({ type: 'workspace/role', role: session.identity.application_roles[0] ?? 'associate' });
        dispatch({ type: 'onboarding/complete', completed: false });
        dispatch({ type: 'onboarding/step', step: 'personal' });
      },
      async signInWithPortal(input) {
        services.portal.queueCredentials(input);
        const session = await services.authenticateWithPortal();
        dispatch({ type: 'auth/set', session, restored: false });
        await syncWorkspace();
        dispatch({ type: 'workspace/role', role: session.identity.application_roles[0] ?? 'associate' });
        dispatch({ type: 'onboarding/complete', completed: false });
        dispatch({ type: 'onboarding/step', step: 'personal' });
      },
      async restoreWithBiometrics() {
        const session = await services.restoreSession();
        dispatch({ type: 'auth/set', session, restored: Boolean(session) });
        if (session) {
          await syncWorkspace();
          dispatch({ type: 'workspace/role', role: session.identity.application_roles[0] ?? 'associate' });
          dispatch({ type: 'onboarding/complete', completed: true });
        }
        return session;
      },
      async logout() {
        await services.logout();
        dispatch({ type: 'auth/set', session: null, restored: false });
        dispatch({ type: 'workspace/load', workspace: createInitialSessionState().workspace });
        dispatch({ type: 'onboarding/complete', completed: false });
        dispatch({ type: 'onboarding/step', step: 'personal' });
      },
      queuePortalCredentials(input) {
        services.portal.queueCredentials(input);
      },
      setActivationField(field, value) {
        dispatch({
          type: 'activation/set',
          email: field === 'email' ? value : state.activation.email,
          associateId: field === 'associateId' ? value : state.activation.associateId,
        });
      },
      setOnboardingProfile(profile) {
        dispatch({ type: 'onboarding/profile', profile: mergeProfile(state.onboarding.profile, profile) });
      },
      setOnboardingSkills(skills) {
        dispatch({ type: 'onboarding/skills', skills });
      },
      addOnboardingSkill(skill) {
        dispatch({ type: 'onboarding/skills', skills: [...state.onboarding.skills, skill] });
      },
      setOnboardingCv(cv) {
        dispatch({ type: 'onboarding/cv', cv: mergeCv(state.onboarding.cv, cv) });
      },
      setOnboardingStep(step) {
        dispatch({ type: 'onboarding/step', step });
      },
      setOnboardingPaused(paused) {
        dispatch({ type: 'onboarding/pause', paused });
      },
      completeOnboarding() {
        dispatch({ type: 'onboarding/complete', completed: true });
      },
      setWorkspaceProfile(profile) {
        dispatch({ type: 'workspace/profile', profile });
      },
      setWorkspaceSkills(skills) {
        dispatch({ type: 'workspace/skills', skills });
      },
      setWorkspaceAssignments(assignments) {
        dispatch({ type: 'workspace/assignments', assignments });
      },
      setWorkspaceApprovals(approvals) {
        dispatch({ type: 'workspace/approvals', approvals });
      },
      setWorkspaceTeam(team) {
        dispatch({ type: 'workspace/team', team });
      },
      setWorkspaceUsers(users) {
        dispatch({ type: 'workspace/users', users });
      },
      setWorkspaceLearnings(learnings) {
        dispatch({ type: 'workspace/learnings', learnings });
      },
      setDrawerOpen(open) {
        dispatch({ type: 'workspace/drawer', drawerOpen: open });
      },
      setRoleTab(role) {
        dispatch({ type: 'workspace/role', role });
      },
      setTeamQuery(query) {
        dispatch({ type: 'workspace/teamQuery', teamQuery: query });
      },
      setUserQuery(query) {
        dispatch({ type: 'workspace/userQuery', userQuery: query });
      },
      setRejectionReason(rejectionReason) {
        dispatch({ type: 'workspace/rejectionReason', rejectionReason });
      },
      setLearningFields(input) {
        if (input.code !== undefined) {
          dispatch({ type: 'workspace/learningCode', learningCode: input.code });
        }
        if (input.subject !== undefined) {
          dispatch({ type: 'workspace/learningSubject', learningSubject: input.subject });
        }
        if (input.dueDate !== undefined) {
          dispatch({ type: 'workspace/learningDueDate', learningDueDate: input.dueDate });
        }
        if (input.assigneeId !== undefined) {
          dispatch({ type: 'workspace/learningAssigneeId', learningAssigneeId: input.assigneeId });
        }
      },
      async saveProfileDraft(profile) {
        await services.saveProfile(profile);
        dispatch({ type: 'workspace/profile', profile });
      },
      async addSkill(associateId, skill) {
        await services.saveSkill(associateId, skill);
        dispatch({ type: 'workspace/skills', skills: [...state.workspace.skills, skill] });
      },
      async saveProgress(associateId, learningAssignmentId, statusPercentage) {
        await services.saveProgress(associateId, learningAssignmentId, statusPercentage);
      },
      async assignLearning(input) {
        await services.assignLearning(input);
        dispatch({
          type: 'workspace/assignments',
          assignments: [
            ...state.workspace.assignments,
            {
              learning_assignment_id: `assignment-${Date.now()}`,
              associate_id: input.associateId,
              learning_code: input.learningCode,
              subject: input.subject,
              date_assigned: new Date().toISOString().slice(0, 10),
              date_due: input.dueDate,
              status: 'not_started',
              status_percentage: 0,
              description: input.instructions ?? '',
              certificate_required: false,
              certificate: null,
              assigned_by: input.assignedBy,
              date_completed: null,
            },
          ],
        });
      },
      async patchRoles(input) {
        const updated = await services.patchRoles({
          associateId: input.associateId,
          applicationRoles: input.applicationRoles,
        });
        dispatch({
          type: 'workspace/users',
          users: state.workspace.users.map((user) => (user.associate_id === updated.associate_id ? updated : user)),
        });
      },
      toggleApprovalStatus(approvalRequestId, status) {
        dispatch({
          type: 'workspace/approvals',
          approvals: state.workspace.approvals.map((item) =>
            item.approvalRequestId === approvalRequestId ? { ...item, status } : item,
          ),
        });
      },
    }),
    [bootstrapFlow, services, state.activation.associateId, state.activation.email, state.onboarding.profile, state.onboarding.skills, state.onboarding.cv, state.workspace, syncWorkspace],
  );

  return <AppServicesContext.Provider value={{ services, state, actions }}>{children}</AppServicesContext.Provider>;
}

export function useAppServices() {
  const value = useContext(AppServicesContext);
  if (!value) {
    throw new Error('AppServicesProvider is required');
  }
  return value;
}

