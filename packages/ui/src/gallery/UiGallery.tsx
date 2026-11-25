import React from 'react';
import {
  AppHeader,
  Avatar,
  BottomTabs,
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  Form,
  FormItem,
  LoadingState,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  SideDrawer,
  Stack,
  StatusBadge,
  TextField,
  ThemeProvider,
} from '..';

export function UiGallery() {
  return (
    <ThemeProvider>
      <ScreenContainer scrollable>
        <Stack spacing={16}>
          <AppHeader title="UI Gallery" trailing={<Avatar name="Jane Doe" label="Jane Doe" />} />
          <SectionHeader title="Buttons" />
          <Button onPress={() => undefined}>Primary action</Button>
          <Card title="Status">
            <StatusBadge tone="approved" label="Approved" />
          </Card>
          <Form>
            <FormItem label="Example">
              <TextField label="Example" value="" onChangeText={() => undefined} />
            </FormItem>
          </Form>
          <ProgressBar current={25} max={100} label="Progress" />
          <DataTable
            rowKey={(row) => row.id}
            columns={[{ key: 'id', title: 'ID', render: (row) => row.id }]}
            data={[{ id: '1' }]}
          />
          <LoadingState />
          <EmptyState title="Nothing here yet" />
          <ErrorState title="Oops" onRetry={() => undefined} />
          <BottomTabs
            selectedKey="home"
            onSelect={() => undefined}
            items={[
              { key: 'home', label: 'Home' },
              { key: 'settings', label: 'Settings' },
            ]}
          />
          <SideDrawer visible={false} onClose={() => undefined} title="Drawer">
            <SectionHeader title="Example" />
          </SideDrawer>
        </Stack>
      </ScreenContainer>
    </ThemeProvider>
  );
}
