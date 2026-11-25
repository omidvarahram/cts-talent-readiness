import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ErrorState, LoadingState, ScreenContainer, Stack, Text } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

export function BootstrapScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();

  useEffect(() => {
    if (state.bootstrap.status === 'ready') {
      navigation.reset({
        index: 0,
        routes: [{ name: state.auth.session ? 'Workspace' : 'Login' }],
      });
    }
  }, [navigation, state.auth.session, state.bootstrap.status]);

  if (state.bootstrap.status === 'loading' || state.bootstrap.status === 'idle') {
    return (
      <ScreenContainer>
        <LoadingState label="Loading app configuration" />
      </ScreenContainer>
    );
  }

  if (state.bootstrap.status === 'error') {
    return (
      <ScreenContainer contentStyle={{ padding: 16 }}>
        <ErrorState
          title="Could not load app config"
          description={state.bootstrap.error}
          actionLabel="Retry"
          retryLabel="Retry"
          onRetry={actions.retryBootstrap}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Stack spacing={12}>
        <Text variant="heading">CTS Talent Readiness</Text>
        <Text tone="muted">Preparing secure app defaults.</Text>
        <Button onPress={() => navigation.reset({ index: 0, routes: [{ name: state.auth.session ? 'Workspace' : 'Login' }] })}>
          Continue
        </Button>
      </Stack>
    </ScreenContainer>
  );
}

