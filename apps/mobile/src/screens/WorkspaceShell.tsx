import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, IconButton, ScreenContainer, Stack, Text, SideDrawer } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

export function WorkspaceShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const navigation = useNavigation<any>();
  const { state, actions, services } = useAppServices();

  return (
    <ScreenContainer scrollable contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Stack spacing={4}>
            <Text variant="heading">{title}</Text>
            {subtitle ? <Text tone="muted">{subtitle}</Text> : null}
          </Stack>
          <IconButton icon="menu" label="Open account drawer" onPress={() => actions.setDrawerOpen(true)} />
        </Stack>
        {children}
      </Stack>
      <SideDrawer visible={state.workspace.drawerOpen} onClose={() => actions.setDrawerOpen(false)} title="Account" widthRatio={0.6}>
        <Stack spacing={12}>
          <Text tone="inverse">One Cognizant and account actions</Text>
          <Button
            fullWidth
            onPress={async () => {
              await WebBrowser.openBrowserAsync(services.runtimeConfig.links.companyPortal);
            }}
          >
            One Cognizant
          </Button>
          <Button
            fullWidth
            variant="danger"
            onPress={async () => {
              await actions.logout();
              actions.setDrawerOpen(false);
              const rootNavigation = navigation.getParent?.() ?? navigation;
              rootNavigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            Logout
          </Button>
        </Stack>
      </SideDrawer>
    </ScreenContainer>
  );
}

