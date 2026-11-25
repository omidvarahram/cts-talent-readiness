import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Stack, Text, TextField } from '@cts-talent/ui';

import { useAppServices } from '../services/AppServicesContext';
import { WorkspaceShell } from './WorkspaceShell';

export function ManagerApprovalsScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useAppServices();

  return (
    <WorkspaceShell title="Manager approvals" subtitle="Approve or reject with a reason">
      <Stack spacing={16}>
        <Button fullWidth variant="secondary" onPress={() => navigation.navigate('ManagerTeam')}>
          Open team search
        </Button>
        <Text variant="subheading">Inbox</Text>
        {state.workspace.approvals.map((item) => (
          <Stack key={item.approvalRequestId} spacing={8}>
            <Text weight="semibold">{item.title}</Text>
            <Text tone="muted">{item.detail}</Text>
            <TextField
              label="Reject reason"
              value={state.workspace.rejectionReason}
              onChangeText={actions.setRejectionReason}
            />
            <Stack direction="horizontal" spacing={12}>
              <Button
                fullWidth
                variant="secondary"
                onPress={() => {
                  actions.toggleApprovalStatus(item.approvalRequestId, 'approved');
                }}
              >
                Approve
              </Button>
              <Button
                fullWidth
                variant="danger"
                onPress={() => {
                  actions.toggleApprovalStatus(item.approvalRequestId, 'rejected');
                }}
              >
                Reject
              </Button>
            </Stack>
            <Text tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'muted'}>
              Status: {item.status}
            </Text>
          </Stack>
        ))}
      </Stack>
    </WorkspaceShell>
  );
}

