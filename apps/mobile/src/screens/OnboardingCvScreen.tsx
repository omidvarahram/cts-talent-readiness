import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, StepTimeline, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

const steps = [
  { key: 'personal', title: 'Personal' },
  { key: 'skills', title: 'Skills' },
  { key: 'cv', title: 'CV & review' },
];

export function OnboardingCvScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();

  return (
    <ScreenContainer scrollable contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Text variant="heading">CV review</Text>
        <StepTimeline steps={steps} currentIndex={2} />
        <TextField
          label="CV file name"
          value={state.onboarding.cv.fileName}
          onChangeText={(fileName) => actions.setOnboardingCv({ fileName })}
        />
        <TextField
          label="Summary"
          value={state.onboarding.cv.summary}
          onChangeText={(summary) => actions.setOnboardingCv({ summary })}
        />
        <Text tone="muted">
          Draft is stored in memory only and can be paused or resumed while the app is running.
        </Text>
        <Stack direction="horizontal" spacing={12}>
          <Button
            fullWidth
            variant={state.onboarding.draftPaused ? 'secondary' : 'ghost'}
            onPress={() => actions.setOnboardingPaused(!state.onboarding.draftPaused)}
          >
            {state.onboarding.draftPaused ? 'Resume draft' : 'Pause draft'}
          </Button>
          <Button
            fullWidth
            onPress={() => {
              actions.completeOnboarding();
              navigation.reset({ index: 0, routes: [{ name: 'Workspace' }] });
            }}
          >
            Finish
          </Button>
        </Stack>
      </Stack>
    </ScreenContainer>
  );
}

