import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, TextField, Text } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ActivationScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();
  const [error, setError] = useState('');

  const continueToPortal = () => {
    const email = state.activation.email.trim();
    const associateId = state.activation.associateId.trim();
    if (!isEmail(email)) {
      setError('Enter a valid work email.');
      return;
    }
    if (!associateId) {
      setError('Enter your associate ID.');
      return;
    }
    setError('');
    navigation.navigate('SsoPortal');
  };

  return (
    <ScreenContainer scrollable contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Stack spacing={8}>
          <Text variant="heading">Activate your account</Text>
          <Text tone="muted">Verify your work email and associate ID before SSO.</Text>
        </Stack>
        <TextField
          label="Work email"
          value={state.activation.email}
          onChangeText={(value) => actions.setActivationField('email', value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Associate ID"
          value={state.activation.associateId}
          onChangeText={(value) => actions.setActivationField('associateId', value)}
          keyboardType="number-pad"
        />
        {error ? <Text tone="danger">{error}</Text> : null}
        <Button login fullWidth onPress={continueToPortal}>
          Continue to SSO
        </Button>
      </Stack>
    </ScreenContainer>
  );
}

