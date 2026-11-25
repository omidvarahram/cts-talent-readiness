import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, Text } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

export function SsoPortalScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();
  const [busy, setBusy] = useState(false);

  return (
    <ScreenContainer contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Stack spacing={8}>
          <Text variant="heading">Company SSO</Text>
          <Text tone="muted">
            Simulated portal for {state.activation.email || 'your email'} and associate ID {state.activation.associateId || 'pending'}.
          </Text>
        </Stack>
        <Button
          login
          fullWidth
          pending={busy}
          onPress={async () => {
            setBusy(true);
            try {
              await actions.signInWithPortal({
                email: state.activation.email,
                associateId: state.activation.associateId,
              });
              navigation.reset({
                index: 0,
                routes: [{ name: 'OnboardingPersonal' }],
              });
            } finally {
              setBusy(false);
            }
          }}
        >
          Sign in with credentials
        </Button>
        <Button fullWidth variant="ghost" onPress={() => navigation.goBack()}>
          Back
        </Button>
      </Stack>
    </ScreenContainer>
  );
}

