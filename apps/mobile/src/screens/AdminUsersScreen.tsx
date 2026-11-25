import React, { useMemo, useState } from 'react';
import type { ApplicationRole } from '@cts-talent/sdk';
import { Button, Stack, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';
import { WorkspaceShell } from './WorkspaceShell';

const allRoles = ['associate', 'manager', 'admin'] as const;

export function AdminUsersScreen() {
  const { state, actions } = useAppServices();
  const [error, setError] = useState('');
  const [roleDrafts, setRoleDrafts] = useState<Record<string, ApplicationRole[]>>({});
  const filteredUsers = useMemo(() => {
    return state.workspace.users.filter((user) => {
      const query = state.workspace.userQuery.toLowerCase();
      return (
        user.associate_name.toLowerCase().includes(query) ||
        user.associate_email.toLowerCase().includes(query) ||
        user.associate_id.includes(query)
      );
    });
  }, [state.workspace.userQuery, state.workspace.users]);

  return (
    <WorkspaceShell title="Admin users" subtitle="Search users and edit additive roles">
      <Stack spacing={16}>
        <TextField label="Search users" value={state.workspace.userQuery} onChangeText={actions.setUserQuery} />
        {error ? <Text tone="danger">{error}</Text> : null}
        {filteredUsers.map((user) => {
          const currentRoles = roleDrafts[user.associate_id] ?? user.application_roles;
          return (
            <Stack key={user.associate_id} spacing={8}>
              <Text weight="semibold">{user.associate_name}</Text>
              <Text tone="muted">
                {user.associate_email} | {user.associate_id}
              </Text>
              <Stack direction="horizontal" spacing={8} wrap>
                {allRoles.map((role) => (
                  <Button
                    key={role}
                    variant={currentRoles.includes(role) ? 'secondary' : 'ghost'}
                    onPress={() => {
                      const nextRoles = currentRoles.includes(role)
                        ? currentRoles.filter((value) => value !== role)
                        : [...currentRoles, role];
                      setRoleDrafts((drafts) => ({ ...drafts, [user.associate_id]: nextRoles }));
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </Stack>
              <Button
                login
                fullWidth
                onPress={async () => {
                  setError('');
                  try {
                    await actions.patchRoles({
                      associateId: user.associate_id,
                      applicationRoles: currentRoles,
                    });
                  } catch (cause) {
                    setError(cause instanceof Error ? cause.message : 'Could not update roles.');
                  }
                }}
              >
                Save roles
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </WorkspaceShell>
  );
}

