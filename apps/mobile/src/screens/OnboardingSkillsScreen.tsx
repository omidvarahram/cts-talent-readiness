import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer, Stack, StepTimeline, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';

const steps = [
  { key: 'personal', title: 'Personal' },
  { key: 'skills', title: 'Skills' },
  { key: 'cv', title: 'CV & review' },
];

export function OnboardingSkillsScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();
  const [skillCode, setSkillCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [years, setYears] = useState('1');
  const [lastUsed, setLastUsed] = useState('2026-11-24');
  const [expertise, setExpertise] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const skills = useMemo(() => state.onboarding.skills, [state.onboarding.skills]);

  return (
    <ScreenContainer scrollable contentStyle={{ padding: 16 }}>
      <Stack spacing={16}>
        <Text variant="heading">Skills</Text>
        <StepTimeline steps={steps} currentIndex={1} />
        <TextField label="Skill code" value={skillCode} onChangeText={setSkillCode} />
        <TextField label="Title" value={title} onChangeText={setTitle} />
        <TextField label="Description" value={description} onChangeText={setDescription} />
        <TextField label="Years of experience" value={years} onChangeText={setYears} keyboardType="number-pad" />
        <TextField label="Last used" value={lastUsed} onChangeText={setLastUsed} />
        <TextField
          label="Expertise"
          value={expertise}
          onChangeText={(value) => setExpertise(value as typeof expertise)}
          helperText="Use beginner, intermediate, or advanced."
        />
        <Button
          login
          fullWidth
          onPress={() => {
            actions.addOnboardingSkill({
              skill_code: skillCode || `SKILL-${skills.length + 1}`,
              title: title || 'New skill',
              description,
              expertise,
              years_of_experience: Number(years) || 1,
              last_used: lastUsed,
            });
            setSkillCode('');
            setTitle('');
            setDescription('');
          }}
        >
          Add skill
        </Button>
        <Stack spacing={8}>
          <Text variant="subheading">Draft skills</Text>
          {skills.length ? (
            skills.map((skill) => (
              <Text key={skill.skill_code}>
                {skill.skill_code} - {skill.title} ({skill.expertise})
              </Text>
            ))
          ) : (
            <Text tone="muted">No skills added yet.</Text>
          )}
        </Stack>
        <Button
          fullWidth
          onPress={() => {
            actions.setOnboardingStep('cv');
            navigation.navigate('OnboardingCv');
          }}
        >
          Next
        </Button>
      </Stack>
    </ScreenContainer>
  );
}

