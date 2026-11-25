import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, Text } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { actions } = useAppServices();

  return (
    <ScreenContainer contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Stack spacing={8}>
          <Text variant="heading">Welcome back</Text>
          <Text tone="muted">Use company SSO or restore your session.</Text>
        </Stack>
        <Stack spacing={12}>
          <Button login fullWidth onPress={() => navigation.navigate('Activation')}>
            Activate account
          </Button>
          <Button login fullWidth variant="secondary" onPress={() => navigation.navigate('Activation')}>
            Continue with company SSO
          </Button>
          <Button
            login
            fullWidth
            variant="ghost"
            onPress={async () => {
              const session = await actions.restoreWithBiometrics();
              if (session) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Workspace' }],
                });
              }
            }}
          >
            Restore with biometrics
          </Button>
        </Stack>
      </Stack>
    </ScreenContainer>
  );
}

