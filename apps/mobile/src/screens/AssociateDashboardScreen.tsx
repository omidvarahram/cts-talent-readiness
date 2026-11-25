import React, { useMemo, useState } from 'react';
import { Button, Stack, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';
import { WorkspaceShell } from './WorkspaceShell';

export function AssociateDashboardScreen() {
  const { state, actions } = useAppServices();
  const profile = state.workspace.profile;
  const [skillCode, setSkillCode] = useState('');
  const [skillTitle, setSkillTitle] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillYears, setSkillYears] = useState('1');
  const [skillLastUsed, setSkillLastUsed] = useState('2026-11-24');
  const [assignmentProgress, setAssignmentProgress] = useState<Record<string, string>>({});
  const visibleAssignments = useMemo(() => state.workspace.assignments, [state.workspace.assignments]);

  return (
    <WorkspaceShell title="Associate dashboard" subtitle="Profile, skills, CV, and assignments">
      <Stack spacing={18}>
        <Stack spacing={10}>
          <Text variant="subheading">Profile</Text>
          <TextField
            label="Name"
            value={profile.name}
            onChangeText={(name) => actions.setWorkspaceProfile({ ...profile, name })}
          />
          <TextField
            label="Email"
            value={profile.email}
            onChangeText={(email) => actions.setWorkspaceProfile({ ...profile, email })}
          />
          <TextField
            label="Phone"
            value={profile.phone}
            onChangeText={(phone) => actions.setWorkspaceProfile({ ...profile, phone })}
          />
          <TextField
            label="Address"
            value={profile.address}
            onChangeText={(address) => actions.setWorkspaceProfile({ ...profile, address })}
          />
          <Button login fullWidth onPress={() => actions.saveProfileDraft(profile)}>
            Save profile
          </Button>
        </Stack>

        <Stack spacing={10}>
          <Text variant="subheading">Skills</Text>
          <TextField label="Skill code" value={skillCode} onChangeText={setSkillCode} />
          <TextField label="Title" value={skillTitle} onChangeText={setSkillTitle} />
          <TextField label="Description" value={skillDescription} onChangeText={setSkillDescription} />
          <TextField label="Years" value={skillYears} onChangeText={setSkillYears} keyboardType="number-pad" />
          <TextField label="Last used" value={skillLastUsed} onChangeText={setSkillLastUsed} />
          <Button
            login
            fullWidth
            onPress={async () => {
              await actions.addSkill(profile.associateId, {
                skill_code: skillCode || `SKILL-${state.workspace.skills.length + 1}`,
                title: skillTitle || 'New skill',
                description: skillDescription,
                expertise: 'intermediate',
                years_of_experience: Number(skillYears) || 1,
                last_used: skillLastUsed,
              });
              setSkillCode('');
              setSkillTitle('');
              setSkillDescription('');
            }}
          >
            Add skill
          </Button>
          {state.workspace.skills.length ? (
            state.workspace.skills.map((skill) => (
              <Text key={skill.skill_code}>
                {skill.skill_code} - {skill.title}
              </Text>
            ))
          ) : (
            <Text tone="muted">No saved skills yet.</Text>
          )}
        </Stack>

        <Stack spacing={10}>
          <Text variant="subheading">CV</Text>
          <TextField
            label="CV file name"
            value={state.onboarding.cv.fileName}
            onChangeText={(fileName) => actions.setOnboardingCv({ fileName })}
          />
          <TextField
            label="CV summary"
            value={state.onboarding.cv.summary}
            onChangeText={(summary) => actions.setOnboardingCv({ summary })}
          />
          <Button
            fullWidth
            onPress={() => {
              actions.setOnboardingPaused(false);
              actions.setOnboardingStep('cv');
            }}
          >
            Edit CV draft
          </Button>
        </Stack>

        <Stack spacing={10}>
          <Text variant="subheading">Assignments</Text>
          {visibleAssignments.length ? (
            visibleAssignments.map((assignment) => (
              <Stack key={assignment.learning_assignment_id} spacing={8}>
                <Text>{assignment.subject}</Text>
                <TextField
                  label="Progress %"
                  value={assignmentProgress[assignment.learning_assignment_id] ?? String(assignment.status_percentage)}
                  onChangeText={(value) =>
                    setAssignmentProgress((current) => ({ ...current, [assignment.learning_assignment_id]: value }))
                  }
                  keyboardType="number-pad"
                />
                <Button
                  variant="secondary"
                  onPress={async () => {
                    await actions.saveProgress(
                      profile.associateId,
                      assignment.learning_assignment_id,
                      Number(assignmentProgress[assignment.learning_assignment_id] ?? assignment.status_percentage),
                    );
                  }}
                >
                  Save progress
                </Button>
              </Stack>
            ))
          ) : (
            <Text tone="muted">No assignments loaded.</Text>
          )}
        </Stack>
      </Stack>
    </WorkspaceShell>
  );
}

