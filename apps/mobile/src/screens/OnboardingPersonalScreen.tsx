import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, StepTimeline, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

const steps = [
  { key: 'personal', title: 'Personal' },
  { key: 'skills', title: 'Skills' },
  { key: 'cv', title: 'CV & review' },
];

export function OnboardingPersonalScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();

  return (
    <ScreenContainer scrollable contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Text variant="heading">Tell us about you</Text>
        <StepTimeline steps={steps} currentIndex={0} />
        <TextField
          label="Full name"
          value={state.onboarding.profile.name}
          onChangeText={(name) => actions.setOnboardingProfile({ name })}
        />
        <TextField
          label="Work email"
          value={state.onboarding.profile.email}
          onChangeText={(email) => actions.setOnboardingProfile({ email })}
          autoCapitalize="none"
        />
        <TextField
          label="Phone"
          value={state.onboarding.profile.phone}
          onChangeText={(phone) => actions.setOnboardingProfile({ phone })}
          keyboardType="phone-pad"
        />
        <TextField
          label="Address"
          value={state.onboarding.profile.address}
          onChangeText={(address) => actions.setOnboardingProfile({ address })}
        />
        <Button
          fullWidth
          onPress={() => {
            actions.setOnboardingStep('skills');
            navigation.navigate('OnboardingSkills');
          }}
        >
          Next
        </Button>
      </Stack>
    </ScreenContainer>
  );
}

