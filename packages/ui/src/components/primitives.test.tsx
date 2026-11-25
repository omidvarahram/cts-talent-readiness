import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Box, Divider, Icon, ScreenContainer, SectionHeader, Stack, Text } from './primitives';

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
    invoke(style as (state: { pressed: boolean }) => unknown);
    return;
  }

  if (Array.isArray(style)) {
    style.forEach((part) => {
      if (typeof part === 'function') {
        invoke(part as (state: { pressed: boolean }) => unknown);
      }
    });
  }
}

describe('primitives', () => {
  it('styles text variants and tones', () => {
    const { getByText } = renderWithTheme(
      <Text variant="heading" tone="primary" weight="bold">
        Heading
      </Text>,
    );

    expect(StyleSheet.flatten(getByText('Heading').props.style)).toEqual(
      expect.objectContaining({ color: '#246fc0' }),
    );
  });

  it('renders decorative and labelled icons', () => {
    const { getByLabelText, queryByText } = renderWithTheme(
      <>
        <Icon name="check" decorative testID="decorative" />
        <Icon name="info" label="Helpful info" decorative={false} />
      </>,
    );

    expect(queryByText('check')).toBeNull();
    expect(getByLabelText('Helpful info')).toBeTruthy();
  });

  it('renders stacked children and separators', () => {
    const { getByTestId } = renderWithTheme(
      <Box testID="box" padding={12}>
        <Stack spacing={8} direction="horizontal" testID="stack">
          <Text>One</Text>
          <Text>Two</Text>
        </Stack>
        <Divider testID="divider" />
      </Box>,
    );

    expect(StyleSheet.flatten(getByTestId('box').props.style)).toEqual(expect.objectContaining({ padding: 12 }));
    expect(getByTestId('divider').props.accessibilityLabel).toBe('Separator');
  });

  it('renders screen containers and section actions', () => {
    const onActionPress = jest.fn();
    const { getByLabelText, getByText } = renderWithTheme(
      <ScreenContainer scrollable keyboardAvoiding={false}>
        <SectionHeader title="Example" subtitle="Details" action={<Text>Go</Text>} onActionPress={onActionPress} actionLabel="Go action" />
      </ScreenContainer>,
    );

    fireEvent.press(getByText('Go'));
    expect(onActionPress).toHaveBeenCalledTimes(1);
    expect(getByText('Example')).toBeTruthy();

    const actionNode = getByLabelText('Go action');
    invokePressableStyle(actionNode);
  });

  it('covers section header fallback action', () => {
    const onActionPress = jest.fn();
    const { getByText } = renderWithTheme(
      <SectionHeader title="Fallback" onActionPress={onActionPress} actionLabel="Do it" />,
    );

    fireEvent.press(getByText('Do it'));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it('covers screen container defaults', () => {
    const { getByText } = renderWithTheme(
      <ScreenContainer>
        <Text>Wrapped</Text>
      </ScreenContainer>,
    );

    expect(getByText('Wrapped')).toBeTruthy();
  });

  it('renders section headers without actions', () => {
    const { getByText } = renderWithTheme(<SectionHeader title="Plain" subtitle="No actions" />);

    expect(getByText('Plain')).toBeTruthy();
    expect(getByText('No actions')).toBeTruthy();
  });
});
