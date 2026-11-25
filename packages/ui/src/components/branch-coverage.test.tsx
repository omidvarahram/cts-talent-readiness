import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import {
  AppHeader,
  Avatar,
  BottomTabs,
  BottomSheet,
  Card,
  CheckboxGroup,
  DateField,
  Divider,
  Dialog,
  EmptyState,
  ErrorState,
  FilePickerField,
  FileRow,
  FormItem,
  InlineAlert,
  ImagePreview,
  LoadingState,
  ProgressBar,
  ProgressLabel,
  SearchField,
  ScreenContainer,
  SectionHeader,
  Select,
  StatusBadge,
  SideDrawer,
  StepTimeline,
  Stack,
  TextField,
  ThemeProvider,
  Toast,
  Checkbox,
  DataTable,
} from '../index';

function renderWithTheme(node: React.ReactElement) {
  return render(<ThemeProvider>{node}</ThemeProvider>);
}

describe('branch coverage variants', () => {
  it('covers theme override branches', () => {
    render(
      <ThemeProvider theme={{ colors: { primary: '#123456' } }}>
        <View />
      </ThemeProvider>,
    );
  });

  it('covers primitive component branches', () => {
    const action = jest.fn();
    renderWithTheme(
      <View>
        <Stack direction="horizontal" reverse spacing="sm" wrap>
          <View />
          <View />
        </Stack>
        <Divider orientation="vertical" />
        <ScreenContainer scrollable={false} keyboardAvoiding={false}>
          <View />
        </ScreenContainer>
        <SectionHeader title="Inbox" actionLabel="Edit" onActionPress={action} />
      </View>,
    );
  });

  it('covers form control branches', () => {
    const onChangeText = jest.fn();
    const onChangeValue = jest.fn();
    const onToggleExpanded = jest.fn();
    const onChangeDates = jest.fn();
    const onChangeChecks = jest.fn();

    renderWithTheme(
      <View>
        <FormItem label="Simple">
          <TextField value="plain" onChangeText={onChangeText} />
        </FormItem>
        <FormItem label="Email" helperText="We will never share this" required>
          <TextField value="a@b.com" onChangeText={onChangeText} placeholder="Email" />
        </FormItem>
        <FormItem label="Disabled" errorText="Invalid" pending>
          <TextField value="x" onChangeText={onChangeText} disabled />
        </FormItem>
        <SearchField value="abc" onChangeText={onChangeText} onClear={onChangeText} showNoResults />
        <Select
          label="Plan"
          value="alpha"
          options={[
            { label: 'Alpha', value: 'alpha' },
            { label: 'Beta', value: 'beta', disabled: true },
          ]}
          onChange={onChangeValue}
          onToggleExpanded={onToggleExpanded}
          expanded
        />
        <DateField
          label="Start date"
          value="2024-01-01"
          onChangeText={onChangeDates}
          minDate="2023-01-01"
          maxDate="2025-01-01"
        />
        <Checkbox label="Accept" checked onToggle={onChangeChecks} />
        <CheckboxGroup
          label="Choices"
          options={[
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two', disabled: true },
          ]}
          value={['one']}
          onChange={onChangeChecks}
        />
      </View>,
    );

    const { getByText, getAllByText } = renderWithTheme(
      <View>
        <Select
          label="Plan"
          value="alpha"
          options={[
            { label: 'Alpha', value: 'alpha' },
            { label: 'Beta', value: 'beta', disabled: true },
          ]}
          onChange={onChangeValue}
          onToggleExpanded={onToggleExpanded}
          expanded
        />
      </View>,
    );

    const alpha = getAllByText('Alpha')[0];
    const beta = getByText('Beta');
    const alphaStyle = alpha.parent?.props.style;
    const betaStyle = beta.parent?.props.style;
    if (typeof alphaStyle === 'function') {
      alphaStyle({ pressed: true });
      alphaStyle({ pressed: false });
    }
    if (typeof betaStyle === 'function') {
      betaStyle({ pressed: true });
    }
  });

  it('covers composite component branches', () => {
    const onClose = jest.fn();
    const onPick = jest.fn();
    const onReplace = jest.fn();
    const onRemove = jest.fn();
    const onView = jest.fn();
    const onDismiss = jest.fn();
    const focusRef = { current: { focus: jest.fn() } } as React.RefObject<{ focus: () => void }>;

    const { getByLabelText, getByText, rerender } = renderWithTheme(
      <View>
        <SideDrawer
          visible
          title="Drawer"
          onClose={onClose}
          onOpenFocusRef={focusRef}
          backdropDismissable={false}
          reduceMotion
        >
          <View />
        </SideDrawer>
        <BottomSheet visible title="Sheet" onClose={onClose} reduceMotion>
          <View />
        </BottomSheet>
        <Dialog visible title="Dialog" onClose={onClose} reduceMotion>
          <View />
        </Dialog>
        <FilePickerField label="Files" onPick={onPick} pending helperText="Optional" />
        <FileRow name="report.pdf" note="Complete" status="complete" onView={onView} onReplace={onReplace} onRemove={onRemove} />
        <ImagePreview uri="https://example.com/image.png" label="Preview" fallbackLabel="No image" />
        <LoadingState label="Loading..." />
        <EmptyState title="Nothing here" description="Try adding files" actionLabel="Reload" onActionPress={onPick} />
        <ErrorState title="Something broke" description="Please retry" actionLabel="Retry" onActionPress={onPick} />
        <Toast visible message="Saved" onDismiss={onDismiss} />
      </View>,
    );

    fireEvent.press(getByText('Reload'));
    rerender(
      <ThemeProvider>
        <View>
          <SideDrawer
            visible={false}
            title="Drawer"
            onClose={onClose}
            backdropDismissable
            reduceMotion={false}
          >
            <View />
          </SideDrawer>
          <BottomSheet visible={false} title="Sheet" onClose={onClose} reduceMotion={false}>
            <View />
          </BottomSheet>
          <Dialog visible={false} title="Dialog" onClose={onClose} reduceMotion={false}>
            <View />
          </Dialog>
          <Toast visible={false} message="Saved" onDismiss={onDismiss} />
          <ImagePreview label="Preview" fallbackLabel="No image" loading />
        </View>
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider>
        <View>
          <SideDrawer
            visible
            title="Drawer"
            onClose={onClose}
            onOpenFocusRef={focusRef}
            backdropDismissable
            reduceMotion={false}
          >
            <View />
          </SideDrawer>
          <BottomSheet visible title="Sheet" onClose={onClose} reduceMotion={false}>
            <View />
          </BottomSheet>
          <Dialog visible title="Dialog" onClose={onClose} reduceMotion={false}>
            <View />
          </Dialog>
          <Toast visible={false} message="Saved" onDismiss={onDismiss} />
          <ImagePreview label="Preview" fallbackLabel="No image" loading />
        </View>
      </ThemeProvider>,
    );

    fireEvent.press(getByLabelText('Dismiss drawer'));
    fireEvent.press(getByLabelText('Dismiss sheet'));
    fireEvent.press(getByLabelText('Dismiss dialog'));
  });

  it('covers status, progress, and table branches', () => {
    const onSelect = jest.fn();

    renderWithTheme(
      <View>
        <AppHeader title="Home" subtitle="Welcome" safeAreaTop />
        <Avatar name="Ada Lovelace" />
        <Avatar name="" />
        <Avatar name="Grace Hopper" uri="https://example.com/avatar.png" />
        <Card title="Card" subtitle="Body copy" />
        <StatusBadge label="Approved" tone="approved" />
        <StatusBadge label="Pending" tone="pending" />
        <StatusBadge label="Rejected" tone="rejected" />
        <InlineAlert tone="info" title="Info" description="Details" />
        <InlineAlert tone="success" title="Success" description="Details" />
        <InlineAlert tone="warning" title="Warning" description="Details" />
        <InlineAlert tone="error" title="Error" description="Details" />
        <ProgressBar current={25} max={100} label="Progress" />
        <ProgressBar current={Number.NaN} max={0} label="Progress" />
        <ProgressLabel current={25} max={100} />
        <ProgressLabel current={Number.NaN} max={0} />
        <StepTimeline
          currentIndex={1}
          steps={[
            { key: 'one', title: 'One' },
            { key: 'two', title: 'Two', description: 'Done' },
          ]}
        />
        <BottomTabs
          items={[
            { key: 'home', label: 'Home' },
            { key: 'search', label: 'Search', icon: 'search', disabled: true },
          ]}
          selectedKey="home"
          onSelect={onSelect}
        />
        <DataTable
          columns={[
            { key: 'name', title: 'Name', render: (row) => row.name },
            { key: 'status', title: 'Status', render: (row) => row.status },
          ]}
          data={[{ name: 'Alpha', status: 'ready' }]}
          rowKey={(row) => row.name}
        />
        <DataTable
          columns={[
            { key: 'name', title: 'Name', render: (row) => row.name },
          ]}
          data={[]}
          rowKey={(row) => row.name}
          emptyLabel="No rows"
        />
      </View>,
    );
  });
});
