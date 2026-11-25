import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ApplicationRole } from '@cts-talent/sdk';

import { useAppServices } from '../services/AppServicesContext';
import { AssociateDashboardScreen } from '../screens/AssociateDashboardScreen';
import { AdminUsersScreen } from '../screens/AdminUsersScreen';
import { ActivationScreen } from '../screens/ActivationScreen';
import { BootstrapScreen } from '../screens/BootstrapScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ManagerApprovalsScreen } from '../screens/ManagerApprovalsScreen';
import { ManagerTeamScreen } from '../screens/ManagerTeamScreen';
import { OnboardingCvScreen } from '../screens/OnboardingCvScreen';
import { OnboardingPersonalScreen } from '../screens/OnboardingPersonalScreen';
import { OnboardingSkillsScreen } from '../screens/OnboardingSkillsScreen';
import { SsoPortalScreen } from '../screens/SsoPortalScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function visibleRoles(roles: ApplicationRole[]) {
  const order: ApplicationRole[] = ['associate', 'manager', 'admin'];
  return order.filter((role) => roles.includes(role));
}

export function WorkspaceTabs() {
  const { state } = useAppServices();
  const roles = state.auth.session?.identity.application_roles ?? ['associate'];
  const tabs = visibleRoles(roles);

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {tabs.includes('associate') ? (
        <Tabs.Screen name="Associate" options={{ title: 'Associate' }}>
          {() => <AssociateDashboardScreen />}
        </Tabs.Screen>
      ) : null}
      {tabs.includes('manager') ? (
        <Tabs.Screen name="Manager" options={{ title: 'Manager' }}>
          {() => <ManagerApprovalsScreen />}
        </Tabs.Screen>
      ) : null}
      {tabs.includes('admin') ? (
        <Tabs.Screen name="Admin" options={{ title: 'Admin' }}>
          {() => <AdminUsersScreen />}
        </Tabs.Screen>
      ) : null}
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Bootstrap">
      <Stack.Screen name="Bootstrap" component={BootstrapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Activation" component={ActivationScreen} />
      <Stack.Screen name="SsoPortal" component={SsoPortalScreen} />
      <Stack.Screen name="OnboardingPersonal" component={OnboardingPersonalScreen} />
      <Stack.Screen name="OnboardingSkills" component={OnboardingSkillsScreen} />
      <Stack.Screen name="OnboardingCv" component={OnboardingCvScreen} />
      <Stack.Screen name="Workspace" component={WorkspaceTabs} />
      <Stack.Screen name="ManagerApprovals" component={ManagerApprovalsScreen} />
      <Stack.Screen name="ManagerTeam" component={ManagerTeamScreen} />
    </Stack.Navigator>
  );
}

