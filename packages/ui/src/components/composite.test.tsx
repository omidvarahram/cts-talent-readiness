import React, { createRef } from 'react';
import { Image, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Text } from './primitives';
import {
  AppHeader,
  Avatar,
  BottomSheet,
  BottomTabs,
  Card,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  FilePickerField,
  FileRow,
  ImagePreview,
  InlineAlert,
  LoadingState,
  ProgressBar,
  ProgressLabel,
  SideDrawer,
  StatusBadge,
  StepTimeline,
  Toast,
} from './composite';

function renderWithTheme(node: React.ReactElement) {
  return render(<ThemeProvider>{node}</ThemeProvider>);
}

function invokePressableStyle(node: { props?: { style?: unknown } } | undefined) {
  const style = node?.props?.style;
  const invoke = (fn: (state: { pressed: boolean }) => unknown) => {
    fn({ pressed: true });
    fn({ pressed: false });
  };

  if (typeof style === 'function') {
    invoke(style);
    return;
  }

  if (Array.isArray(style)) {
    style.forEach((part) => {
      if (typeof part === 'function') {
        invoke(part);
      }
    });
  }
}

describe('composite components', () => {
  it('renders headers, cards, badges and alerts', () => {
    const { getByText, getAllByText, getByLabelText } = renderWithTheme(
      <>
        <AppHeader title="Dashboard" subtitle="Overview" leading={<Avatar name="Jane Doe" />} trailing={<StatusBadge tone="approved" label="Approved" />} />
        <Card title="Summary" subtitle="This week" footer={<StatusBadge tone="pending" label="Pending" />}>
          <InlineAlert title="Attention" message="Please review." severity="warning" />
        </Card>
        <InlineAlert title="Needs action" message="Try again." severity="error" actionLabel="Retry now" onActionPress={jest.fn()} />
      </>,
    );

    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Attention')).toBeTruthy();
    const action = getByLabelText('Retry now');
    invokePressableStyle(action);
  });

  it('renders progress, timeline and tabs', () => {
    const onSelect = jest.fn();
    const { getByText, getAllByText } = renderWithTheme(
      <>
        <ProgressBar current={25} max={100} label="Completion" pending={75} />
        <ProgressLabel current={25} max={100} label="Completion" pending={75} />
        <StepTimeline
          currentIndex={1}
          steps={[
            { key: 'a', title: 'Start' },
            { key: 'b', title: 'Middle', description: 'In progress' },
            { key: 'c', title: 'End' },
          ]}
        />
        <BottomTabs
          items={[
            { key: 'home', label: 'Home' },
            { key: 'search', label: 'Search' },
          ]}
          selectedKey="home"
          onSelect={onSelect}
        />
      </>,
    );

    fireEvent.press(getByText('Search'));
    expect(onSelect).toHaveBeenCalledWith('search');
    expect(getByText('Completion: 25/100')).toBeTruthy();
  });

  it('renders tables, file rows and upload helpers', () => {
    const onPick = jest.fn();
    const onView = jest.fn();
    const onReplace = jest.fn();
    const onRemove = jest.fn();
    const { getByText, getAllByText } = renderWithTheme(
      <>
        <FilePickerField label="Upload CV" onPick={onPick} pending helperText="PDF only" />
        <FileRow name="cv.pdf" status="complete" note="Uploaded" onView={onView} onReplace={onReplace} onRemove={onRemove} />
        <DataTable
          rowKey={(row: { id: string }) => row.id}
          columns={[
            { key: 'id', title: 'ID', width: 120, render: (row: { id: string }) => row.id },
            { key: 'name', title: 'Name', render: (row: { id: string }) => row.id.toUpperCase() },
          ]}
          data={[{ id: 'a1' }]}
          hint="Swipe to compare"
        />
      </>,
    );

    fireEvent.press(getByText('Upload CV'));
    fireEvent.press(getByText('View'));
    fireEvent.press(getByText('Replace'));
    fireEvent.press(getByText('Remove'));

    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onView).toHaveBeenCalledTimes(1);
    expect(onReplace).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(getByText('Swipe to compare')).toBeTruthy();
    expect(getByText('Swipe to compare')).toBeTruthy();
  });

  it('covers file row status variants', () => {
    const { getByText } = renderWithTheme(
      <>
        <FileRow name="draft.pdf" status="selected" />
        <FileRow name="uploading.pdf" status="uploading" />
        <FileRow name="error.pdf" status="error" />
        <FileRow name="complete.pdf" status="complete" />
      </>,
    );

    expect(getByText('Selected')).toBeTruthy();
    expect(getByText('Uploading')).toBeTruthy();
    expect(getByText('Error')).toBeTruthy();
    expect(getByText('Complete')).toBeTruthy();
  });

  it('renders overlays and state components', () => {
    const drawerClose = jest.fn();
    const sheetClose = jest.fn();
    const dialogClose = jest.fn();
    const focus = jest.fn();
    const focusRef = createRef<{ focus?: () => void }>();
    focusRef.current = { focus };

    const { getByLabelText, getByText, queryByText } = renderWithTheme(
      <>
        <SideDrawer visible onClose={drawerClose} title="Drawer" onOpenFocusRef={focusRef}>
          <StatusBadge tone="approved" label="Approved" />
        </SideDrawer>
        <BottomSheet visible onClose={sheetClose} title="Sheet">
          <EmptyState title="No sheet content" />
        </BottomSheet>
        <Dialog visible onClose={dialogClose} title="Dialog">
          <LoadingState />
        </Dialog>
        <ImagePreview uri="https://example.com/image.png" label="Preview" fallbackLabel="Fallback" loading />
        <Toast visible message="Saved" tone="success" onDismiss={() => undefined} />
        <ErrorState title="Retryable" description="Try again" onRetry={() => undefined} />
      </>,
    );

    expect(focus).toHaveBeenCalledTimes(1);
    fireEvent.press(getByLabelText('Close drawer'));
    fireEvent.press(getByLabelText('Close sheet'));
    fireEvent.press(getByLabelText('Close dialog'));
    expect(drawerClose).toHaveBeenCalledTimes(1);
    expect(sheetClose).toHaveBeenCalledTimes(1);
    expect(dialogClose).toHaveBeenCalledTimes(1);
    expect(getByText('Saved')).toBeTruthy();
    expect(queryByText('Try again')).toBeTruthy();
  });

  it('renders avatar fallback and hidden toast state deterministically', () => {
    const { UNSAFE_getByType, getByText, queryByText, rerender } = renderWithTheme(
      <Avatar name="Single Name" label="Single Name" uri="https://example.com/avatar.png" />,
    );

    fireEvent(UNSAFE_getByType(Image), 'error');
    expect(getByText('SN')).toBeTruthy();

    rerender(
      <ThemeProvider>
        <Toast visible={false} message="Hidden" />
      </ThemeProvider>,
    );

    expect(queryByText('Hidden')).toBeNull();
  });

  it('covers overlay motion and fallback branches', () => {
    const drawerClose = jest.fn();
    const sheetClose = jest.fn();
    const dialogClose = jest.fn();
    const focusRef = createRef<{ focus?: () => void }>();
    focusRef.current = { focus: jest.fn() };

    const { getByLabelText, getByText, UNSAFE_getAllByType } = renderWithTheme(
      <>
        <SideDrawer visible onClose={drawerClose} title="Drawer" onOpenFocusRef={focusRef} reduceMotion backdropDismissable={false}>
          <StatusBadge tone="pending" label="Pending" />
        </SideDrawer>
        <BottomSheet visible onClose={sheetClose} title="Sheet" reduceMotion>
          <EmptyState title="No sheet content" />
        </BottomSheet>
        <Dialog visible onClose={dialogClose} title="Dialog" reduceMotion>
          <LoadingState />
        </Dialog>
        <BottomTabs
          items={[
            { key: 'home', label: 'Home', icon: 'home' },
            { key: 'search', label: 'Search' },
            { key: 'settings', label: 'Settings', disabled: true },
          ]}
          selectedKey="home"
          onSelect={jest.fn()}
        />
        <FilePickerField label="Upload file" onPick={jest.fn()} />
        <ImagePreview label="Broken image" fallbackLabel="Fallback image" />
        <ImagePreview label="Shown image" uri="https://example.com/image.png" />
        <ImagePreview label="Loading image" loading />
      </>,
    );

    fireEvent.press(getByLabelText('Close drawer'));
    fireEvent.press(getByLabelText('Close sheet'));
    fireEvent.press(getByLabelText('Close dialog'));

    const homeTab = getByLabelText('Home');
    invokePressableStyle(homeTab);
    const settingsTab = getByLabelText('Settings');
    invokePressableStyle(settingsTab);

    const filePicker = getByLabelText('Upload file');
    invokePressableStyle(filePicker);

    expect(getByText('Fallback image')).toBeTruthy();
    expect(getByLabelText('Broken image')).toBeTruthy();
    expect(getByLabelText('Shown image')).toBeTruthy();
    expect(getByLabelText('Loading image')).toBeTruthy();

    const previewImage = UNSAFE_getAllByType(Image).find((node) => typeof node.props.onError === 'function');
    if (previewImage) {
      fireEvent(previewImage, 'error', { nativeEvent: { error: new Error('image failed') } });
    }
  });

  it('covers empty state actions and drawer layout', () => {
    const drawerClose = jest.fn();
    const emptyAction = jest.fn();
    const focusRef = createRef<{ focus?: () => void }>();
    focusRef.current = { focus: jest.fn() };

    const { UNSAFE_getAllByType, getByLabelText, getByText } = renderWithTheme(
      <>
        <EmptyState title="Nothing here" actionLabel="Create one" onActionPress={emptyAction} />
        <SideDrawer visible onClose={drawerClose} title="Drawer" onOpenFocusRef={focusRef}>
          <StatusBadge tone="approved" label="Approved" />
        </SideDrawer>
      </>,
    );

    const layoutTarget = UNSAFE_getAllByType(View).find((node) => typeof node.props.onLayout === 'function');
    if (layoutTarget) {
      fireEvent(layoutTarget, 'layout', { nativeEvent: { layout: { width: 900 } } });
    }

    fireEvent.press(getByLabelText('Dismiss drawer'));
    fireEvent.press(getByLabelText('Close drawer'));
    fireEvent.press(getByText('Create one'));

    expect(emptyAction).toHaveBeenCalledTimes(1);
    expect(drawerClose).toHaveBeenCalled();
  });

  it('covers hidden reduced-motion overlays and label fallback images', () => {
    const { queryByText, getByText } = renderWithTheme(
      <>
        <SideDrawer visible={false} onClose={jest.fn()} title="Hidden drawer" reduceMotion>
          <Text>Hidden drawer body</Text>
        </SideDrawer>
        <BottomSheet visible={false} onClose={jest.fn()} title="Hidden sheet" reduceMotion>
          <Text>Hidden sheet body</Text>
        </BottomSheet>
        <Dialog visible={false} onClose={jest.fn()} title="Hidden dialog" reduceMotion>
          <Text>Hidden dialog body</Text>
        </Dialog>
        <ImagePreview label="Label only" />
      </>,
    );

    expect(queryByText('Hidden drawer')).toBeNull();
    expect(queryByText('Hidden sheet')).toBeNull();
    expect(queryByText('Hidden dialog')).toBeNull();
    expect(getByText('Label only')).toBeTruthy();
  });

  it('covers overlay hide rerender', () => {
    const onClose = jest.fn();
    const { rerender, queryByText } = renderWithTheme(
      <SideDrawer visible onClose={onClose} title="Rerender drawer">
        <StatusBadge tone="approved" label="Ready" />
      </SideDrawer>,
    );

    rerender(
      <ThemeProvider>
        <SideDrawer visible={false} onClose={onClose} title="Rerender drawer">
          <StatusBadge tone="approved" label="Ready" />
        </SideDrawer>
      </ThemeProvider>,
    );

    expect(queryByText('Rerender drawer')).toBeNull();
  });
});
