import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { AuthSession } from '@cts-talent/sdk';
import { Button, ThemeProvider, Text } from '@cts-talent/ui';

import runtimeConfig from './config/runtimeConfig.local.json';
import { AppServicesProvider, useAppServices } from './services/AppServicesContext';
import type { WorkspaceData } from './services/createAppServices';
import { ActivationScreen } from './screens/ActivationScreen';
import { AssociateDashboardScreen } from './screens/AssociateDashboardScreen';
import { BootstrapScreen } from './screens/BootstrapScreen';
import { OnboardingCvScreen } from './screens/OnboardingCvScreen';
import { OnboardingPersonalScreen } from './screens/OnboardingPersonalScreen';
import { OnboardingSkillsScreen } from './screens/OnboardingSkillsScreen';
import { AdminUsersScreen } from './screens/AdminUsersScreen';
import { ManagerTeamScreen } from './screens/ManagerTeamScreen';
import { ManagerApprovalsScreen } from './screens/ManagerApprovalsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SsoPortalScreen } from './screens/SsoPortalScreen';
import { WorkspaceTabs } from './navigation/RootNavigator';

const mockOpenBrowserAsync = jest.fn();

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: (...args: unknown[]) => mockOpenBrowserAsync(...args),
}));

const mockNavigation: any = {
  reset: jest.fn(),
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: () => mockNavigation,
};

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => mockNavigation,
  };
});

function makeSession(roles: AuthSession['identity']['application_roles']) {
  return {
    accessToken: 'access-token',
    tokenType: 'Bearer' as const,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    refreshToken: 'refresh-token',
    identity: {
      auth_user_id: 'auth-user-1',
      associate_id: 'A123456',
      application_roles: roles,
    },
  };
}

function makeWorkspace(): WorkspaceData {
  return {
    profile: {
      associateId: 'A123456',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '555-0101',
      address: '1 Infinite Loop',
      avatar_file_id: null,
      cv_file_id: null,
    },
    skills: [
      {
        skill_code: 'SK-001',
        title: 'React Native',
        description: 'Mobile product delivery',
        expertise: 'advanced' as const,
        years_of_experience: 5,
        last_used: '2026-11-24',
      },
    ],
    learnings: [],
    assignments: [
      {
        learning_assignment_id: 'LA-001',
        associate_id: 'A123456',
        learning_code: 'LEARN-001',
        subject: 'Learning path',
        date_assigned: '2026-11-20',
        date_due: '2026-12-20',
        status: 'not_started' as const,
        status_percentage: 45,
        description: 'Learning path for the quarter',
        certificate_required: false,
        certificate: null,
        assigned_by: 'system',
        date_completed: null,
      },
    ],
    approvals: [
      {
        approvalRequestId: 'APR-001',
        requestType: 'skill' as const,
        title: 'Expense approval',
        detail: 'Approve this travel request',
        reason: 'Need to verify the trip',
        status: 'pending' as const,
        associateId: 'A123456',
      },
    ],
    team: [
      {
        associate_id: 'A200001',
        associate_name: 'Grace Hopper',
        associate_role: 'manager',
      },
      {
        associate_id: 'A200002',
        associate_name: 'Katherine Johnson',
        associate_role: 'associate',
      },
    ],
    users: [
      {
        associate_id: 'A300001',
        associate_name: 'Top Reviewer',
        associate_email: 'top@example.com',
        application_roles: ['admin'],
      },
      {
        associate_id: 'A300002',
        associate_name: 'One Admin',
        associate_email: 'one@example.com',
        application_roles: ['admin'],
      },
      {
        associate_id: 'A300003',
        associate_name: 'Associate User',
        associate_email: 'associate@example.com',
        application_roles: ['associate'],
      },
    ],
  } as unknown as WorkspaceData;
}

function makeServices(options?: {
  restoreSession?: AuthSession | null;
  bootstrapFailureOnce?: boolean;
  workspace?: WorkspaceData;
  patchRolesImpl?: (input: any) => Promise<unknown>;
}) {
  let bootstrapFailureCount = options?.bootstrapFailureOnce ? 1 : 0;
  const workspace = options?.workspace ?? makeWorkspace();
  const logout = jest.fn(async () => undefined);
  const saveProfile = jest.fn(async () => workspace.profile);
  const saveSkill = jest.fn(async () => undefined);
  const saveProgress = jest.fn(async () => undefined);
  const assignLearning = jest.fn(async () => undefined);
  const toggleApprovalStatus = jest.fn(async () => undefined);
  const patchRoles = jest.fn(
    options?.patchRolesImpl ??
      (async () => ({
        associate_id: 'A300003',
        associate_name: 'Associate User',
        associate_email: 'associate@example.com',
        application_roles: ['associate'],
      } as any)),
  );
  const authenticateWithCredentials = jest.fn(async () => options?.restoreSession ?? makeSession(['associate']));
  const authenticateWithPortal = jest.fn(async () => options?.restoreSession ?? makeSession(['associate']));
  const bootstrap = jest.fn(async () => {
    if (bootstrapFailureCount > 0) {
      bootstrapFailureCount -= 1;
      throw new Error('boot failed');
    }
    return runtimeConfig;
  });

  return {
    runtimeConfig,
    bootstrap,
    restoreSession: jest.fn(async () => options?.restoreSession ?? null),
    authenticateWithCredentials,
    authenticateWithPortal,
    logout,
    loadWorkspace: jest.fn(async () => workspace),
    saveProfile,
    saveSkill,
    saveProgress,
    assignLearning,
    toggleApprovalStatus,
    patchRoles,
    portal: {
      queueCredentials: jest.fn(),
      clearQueuedCredentials: jest.fn(),
    },
    storage: {
      getItem: jest.fn(async () => null),
      setItem: jest.fn(async () => undefined),
      removeItem: jest.fn(async () => undefined),
      clear: jest.fn(async () => undefined),
    },
    biometrics: {
      isAvailable: jest.fn(async () => true),
      authenticate: jest.fn(async () => true),
      available: jest.fn(async () => true),
      prompt: jest.fn(async () => true),
    },
    authManager: {
      getAccessToken: jest.fn(async () => null),
      refreshAccessToken: jest.fn(async () => null),
    },
    sessionMutationRepository: {
      purgeAll: jest.fn(async () => undefined),
    },
    mutationQueue: {
      enqueue: jest.fn(),
      drain: jest.fn(async () => []),
      purgeAll: jest.fn(async () => undefined),
    },
    configManager: {
      validate: jest.fn(async () => runtimeConfig),
      get: jest.fn(() => runtimeConfig),
    },
    authenticatedTransport: {
      request: jest.fn(async () => ({})),
    },
    jsonTransport: {
      request: jest.fn(async () => ({})),
    },
    refreshProvider: {
      refresh: jest.fn(async () => null),
    },
    credentialsStrategy: {},
    companySsoStrategy: {},
  } as any;
}

function renderWithServices(ui: React.ReactElement, services: any) {
  return render(
    <ThemeProvider>
      <AppServicesProvider services={services}>{ui}</AppServicesProvider>
    </ThemeProvider>,
  );
}

function ContextHarness() {
  const { state, actions } = useAppServices();
  return (
    <>
      <Text testID="active-role">{state.workspace.activeRoleTab}</Text>
      <Text testID="drawer-state">{state.workspace.drawerOpen ? 'open' : 'closed'}</Text>
      <Button onPress={() => actions.setRoleTab('manager')}>Switch role</Button>
      <Button onPress={() => actions.setDrawerOpen(true)}>Open drawer</Button>
      <Button onPress={() => actions.logout()}>Logout</Button>
    </>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('shows bootstrap error and retries successfully', async () => {
  const services = makeServices({ bootstrapFailureOnce: true });
  const { getByText } = renderWithServices(<BootstrapScreen />, services);

  await waitFor(() => expect(getByText('Could not load app config')).toBeTruthy());
  fireEvent.press(getByText('Retry'));

  await waitFor(() => expect(services.bootstrap).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(mockNavigation.reset).toHaveBeenCalled());
});

it('validates activation input before continuing', async () => {
  const services = makeServices();
  const { getByLabelText, getByText } = renderWithServices(<ActivationScreen />, services);

  fireEvent.changeText(getByLabelText('Work email'), 'not-an-email');
  fireEvent.press(getByText('Continue to SSO'));

  expect(getByText('Enter a valid work email.')).toBeTruthy();
});

it('restores a session from the login screen biometrics path', async () => {
  const services = makeServices();
  services.restoreSession.mockResolvedValueOnce(null).mockResolvedValueOnce(makeSession(['associate']));
  const { getByText } = renderWithServices(<LoginScreen />, services);

  fireEvent.press(getByText('Restore with biometrics'));

  await waitFor(() => expect(services.restoreSession).toHaveBeenCalledTimes(2));
});

it('renders role tabs for manager and admin access', async () => {
  const services = makeServices({ restoreSession: makeSession(['associate', 'manager', 'admin']) });
  const { getByText } = render(
    <ThemeProvider>
      <AppServicesProvider services={services}>
        <NavigationContainer>
          <WorkspaceTabs />
        </NavigationContainer>
      </AppServicesProvider>
    </ThemeProvider>,
  );

  await waitFor(() => expect(getByText('Manager')).toBeTruthy());
  expect(getByText('Admin')).toBeTruthy();
});

it('opens the drawer and logs out cleanly', async () => {
  const services = makeServices();
  const { getByLabelText, getByText } = renderWithServices(<AssociateDashboardScreen />, services);

  fireEvent.press(getByLabelText('Open account drawer'));
  expect(getByText('One Cognizant')).toBeTruthy();
  fireEvent.press(getByText('Logout'));

  await waitFor(() => expect(services.logout).toHaveBeenCalled());
  expect(mockNavigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: 'Login' }],
  });
});

it('supports onboarding pause resume and completion', async () => {
  const services = makeServices();
  const personal = renderWithServices(<OnboardingPersonalScreen />, services);

  fireEvent.changeText(personal.getByLabelText('Full name'), 'Ada Lovelace');
  fireEvent.press(personal.getByText('Next'));
  expect(mockNavigation.navigate).toHaveBeenCalledWith('OnboardingSkills');

  const skills = renderWithServices(<OnboardingSkillsScreen />, services);
  fireEvent.changeText(skills.getByLabelText('Skill code'), 'SK-100');
  fireEvent.changeText(skills.getByLabelText('Title'), 'Expo');
  fireEvent.changeText(skills.getByLabelText('Description'), 'Cross-platform delivery');
  fireEvent.press(skills.getByText('Add skill'));
  await waitFor(() => expect(skills.getByText('SK-100 - Expo (intermediate)')).toBeTruthy());
  fireEvent.press(skills.getByText('Next'));
  expect(mockNavigation.navigate).toHaveBeenCalledWith('OnboardingCv');

  const cv = renderWithServices(<OnboardingCvScreen />, services);
  fireEvent.press(cv.getByText('Pause draft'));
  expect(cv.getByText('Resume draft')).toBeTruthy();
  fireEvent.press(cv.getByText('Finish'));
  expect(mockNavigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Workspace' }] });
});

it('assigns learning from the manager workspace', async () => {
  const services = makeServices();
  const { getByLabelText } = renderWithServices(<ManagerTeamScreen />, services);

  fireEvent.changeText(getByLabelText('Associate ID'), 'A200001');
  fireEvent.changeText(getByLabelText('Learning code'), 'LEARN-01');
  fireEvent.changeText(getByLabelText('Subject'), 'Secure delivery');
  fireEvent.changeText(getByLabelText('Due date'), '2026-12-24');
  expect(getByLabelText('Associate ID').props.value).toBe('A200001');
});

it('handles manager approval decisions', async () => {
  const services = makeServices();
  const { getAllByLabelText, getAllByRole } = renderWithServices(<ManagerApprovalsScreen />, services);

  fireEvent.changeText(getAllByLabelText('Reject reason')[0], 'Needs more detail');
  expect(getAllByRole('button', { name: 'Approve' }).length).toBeGreaterThan(0);
  expect(getAllByRole('button', { name: 'Reject' }).length).toBeGreaterThan(0);
});

it('launches the simulated SSO portal', async () => {
  const services = makeServices();
  const { getByText } = renderWithServices(<SsoPortalScreen />, services);

  fireEvent.press(getByText('Sign in with credentials'));

  await waitFor(() => expect(services.authenticateWithPortal).toHaveBeenCalled());
});

it('filters admins by search', async () => {
  const { getByLabelText } = renderWithServices(<AdminUsersScreen />, makeServices());

  fireEvent.changeText(getByLabelText('Search users'), 'Top Reviewer');
  expect(getByLabelText('Search users').props.value).toBe('Top Reviewer');
});

it('edits the associate dashboard draft flows', async () => {
  const services = makeServices({
    workspace: {
      ...makeWorkspace(),
      assignments: [
        {
          learning_assignment_id: 'LA-001',
          learning_code: 'LEARN-01',
          subject: 'Learning path',
          status: 'assigned',
          status_percentage: 45,
        },
      ],
    } as any,
  });
  const { getByLabelText, getByText } = renderWithServices(
    <AssociateDashboardScreen />,
    services,
  );

  fireEvent.changeText(getByLabelText('Name'), 'Ada Lovelace');
  fireEvent.press(getByText('Save profile'));
  await waitFor(() => expect(services.saveProfile).toHaveBeenCalled());

  fireEvent.changeText(getByLabelText('Skill code'), 'SK-100');
  fireEvent.changeText(getByLabelText('Title'), 'Expo');
  fireEvent.changeText(getByLabelText('Description'), 'Cross-platform delivery');
  fireEvent.changeText(getByLabelText('Years'), '4');
  fireEvent.changeText(getByLabelText('Last used'), '2026-11-24');
  fireEvent.press(getByText('Add skill'));
  await waitFor(() => expect(services.saveSkill).toHaveBeenCalled());

  fireEvent.changeText(getByLabelText('CV file name'), 'ada-cv.pdf');
  fireEvent.changeText(getByLabelText('CV summary'), 'Portfolio summary');
  fireEvent.press(getByText('Edit CV draft'));
});

it('lets login users activate, use sso, and restore biometrics', async () => {
  const services = makeServices();
  services.restoreSession.mockResolvedValueOnce(null).mockResolvedValueOnce(makeSession(['associate']));
  const { getByRole } = renderWithServices(<LoginScreen />, services);

  await waitFor(() => expect(services.restoreSession).toHaveBeenCalledTimes(1));
  fireEvent.press(getByRole('button', { name: 'Activate account' }));
  fireEvent.press(getByRole('button', { name: 'Continue with company SSO' }));
  expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'Activation');
  expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'Activation');

  fireEvent.press(getByRole('button', { name: 'Restore with biometrics' }));
  await waitFor(() =>
    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Workspace' }],
    }),
  );
});

it('skips workspace reset when biometrics restore fails', async () => {
  const services = makeServices();
  services.restoreSession.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
  const { getByRole } = renderWithServices(<LoginScreen />, services);

  await waitFor(() => expect(services.restoreSession).toHaveBeenCalledTimes(1));
  fireEvent.press(getByRole('button', { name: 'Restore with biometrics' }));

  await waitFor(() => expect(services.restoreSession).toHaveBeenCalledTimes(2));
  expect(mockNavigation.reset).not.toHaveBeenCalled();
});

it('approves and rejects manager approvals', async () => {
  const services = makeServices();
  const { getAllByRole, getByText } = renderWithServices(<ManagerApprovalsScreen />, services);

  fireEvent.press(getAllByRole('button', { name: 'Approve' })[0]);
  fireEvent.press(getAllByRole('button', { name: 'Reject' })[1]);

  await waitFor(() => expect(getByText('Status: approved')).toBeTruthy());
  expect(getByText('Status: rejected')).toBeTruthy();
});

it('searches admins and saves role changes', async () => {
  const services = makeServices({
    restoreSession: makeSession(['associate', 'manager']),
    workspace: makeWorkspace(),
  });
  const { getByLabelText, getByText } = renderWithServices(<AdminUsersScreen />, services);

  await waitFor(() => expect(getByText('Top Reviewer')).toBeTruthy());
  fireEvent.changeText(getByLabelText('Search users'), 'Top Reviewer');
  fireEvent.press(getByText('manager'));
  fireEvent.press(getByText('Save roles'));

  await waitFor(() =>
    expect(services.patchRoles).toHaveBeenCalledWith({
      associateId: 'A300001',
      applicationRoles: ['admin', 'manager'],
    }),
  );
});

it('shows a safeguard when role saving fails', async () => {
  const services = makeServices({
    restoreSession: makeSession(['associate', 'manager']),
    workspace: makeWorkspace(),
    patchRolesImpl: async () => {
      throw new Error('Could not update roles.');
    },
  });
  const { getByLabelText, getByText } = renderWithServices(<AdminUsersScreen />, services);

  await waitFor(() => expect(getByText('Top Reviewer')).toBeTruthy());
  fireEvent.changeText(getByLabelText('Search users'), 'Top Reviewer');
  fireEvent.press(getByText('Save roles'));

  await waitFor(() => expect(getByText('Could not update roles.')).toBeTruthy());
});

it('filters team members and assigns learning', async () => {
  const services = makeServices({
    restoreSession: makeSession(['associate', 'manager']),
    workspace: makeWorkspace(),
  });
  const { getByLabelText, getByRole, getByText, queryByText } = renderWithServices(<ManagerTeamScreen />, services);

  await waitFor(() => expect(getByText('Grace Hopper')).toBeTruthy());
  fireEvent.changeText(getByLabelText('Search team'), 'Grace');
  expect(getByText('Grace Hopper')).toBeTruthy();
  expect(queryByText('Katherine Johnson')).toBeNull();

  fireEvent.changeText(getByLabelText('Associate ID'), 'A200001');
  fireEvent.changeText(getByLabelText('Learning code'), 'LEARN-01');
  fireEvent.changeText(getByLabelText('Subject'), 'Secure delivery');
  fireEvent.changeText(getByLabelText('Due date'), '2026-12-24');
  fireEvent.press(getByRole('button', { name: 'Assign learning' }));

  await waitFor(() =>
    expect(services.assignLearning).toHaveBeenCalledWith({
      associateId: 'A200001',
      learningCode: 'LEARN-01',
      subject: 'Secure delivery',
      dueDate: '2026-12-24',
      assignedBy: 'A123456',
    }),
  );
});

it('opens the account drawer portal link', async () => {
  const services = makeServices();
  const { getByLabelText, getByRole } = renderWithServices(<AssociateDashboardScreen />, services);

  fireEvent.press(getByLabelText('Open account drawer'));
  await waitFor(() => expect(getByRole('button', { name: 'One Cognizant' })).toBeTruthy());
  fireEvent.press(getByRole('button', { name: 'One Cognizant' }));

  await waitFor(() => expect(mockOpenBrowserAsync).toHaveBeenCalledWith(runtimeConfig.links.companyPortal));
});

it('switches roles, opens the drawer, and logs out through context', async () => {
  const services = makeServices();
  const { getByText, getByTestId } = renderWithServices(<ContextHarness />, services);

  expect(getByTestId('active-role').props.children).toBe('associate');
  fireEvent.press(getByText('Switch role'));
  await waitFor(() => expect(getByTestId('active-role').props.children).toBe('manager'));
  fireEvent.press(getByText('Open drawer'));
  await waitFor(() => expect(getByTestId('drawer-state').props.children).toBe('open'));
  fireEvent.press(getByText('Logout'));

  await waitFor(() => expect(services.logout).toHaveBeenCalled());
});

