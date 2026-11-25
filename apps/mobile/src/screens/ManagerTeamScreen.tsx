import React from 'react';
import { Button, Stack, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';
import { WorkspaceShell } from './WorkspaceShell';

export function ManagerTeamScreen() {
  const { state, actions } = useAppServices();
  const filteredTeam = state.workspace.team.filter((member) =>
    member.associate_name.toLowerCase().includes(state.workspace.teamQuery.toLowerCase()) ||
    member.associate_id.includes(state.workspace.teamQuery),
  );

  return (
    <WorkspaceShell title="Manager team" subtitle="Search team members and assign learning">
      <Stack spacing={16}>
        <TextField label="Search team" value={state.workspace.teamQuery} onChangeText={actions.setTeamQuery} />
        <Stack spacing={8}>
          {filteredTeam.length ? (
            filteredTeam.map((member) => (
              <Stack key={member.associate_id} spacing={4}>
                <Text weight="semibold">{member.associate_name}</Text>
                <Text tone="muted">
                  {member.associate_role} | {member.associate_id}
                </Text>
              </Stack>
            ))
          ) : (
            <Text tone="muted">No team members found.</Text>
          )}
        </Stack>

        <Stack spacing={10}>
          <Text variant="subheading">Assign learning</Text>
          <TextField label="Associate ID" value={state.workspace.learningAssigneeId} onChangeText={(value) => actions.setLearningFields({ assigneeId: value })} />
          <TextField label="Learning code" value={state.workspace.learningCode} onChangeText={(value) => actions.setLearningFields({ code: value })} />
          <TextField label="Subject" value={state.workspace.learningSubject} onChangeText={(value) => actions.setLearningFields({ subject: value })} />
          <TextField label="Due date" value={state.workspace.learningDueDate} onChangeText={(value) => actions.setLearningFields({ dueDate: value })} />
          <Button
            login
            fullWidth
            onPress={async () => {
              await actions.assignLearning({
                associateId: state.workspace.learningAssigneeId,
                learningCode: state.workspace.learningCode,
                subject: state.workspace.learningSubject,
                dueDate: state.workspace.learningDueDate,
                assignedBy: state.auth.session?.identity.associate_id ?? 'system',
              });
            }}
          >
            Assign learning
          </Button>
        </Stack>
      </Stack>
    </WorkspaceShell>
  );
}

