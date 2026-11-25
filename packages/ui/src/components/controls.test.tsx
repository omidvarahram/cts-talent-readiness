import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Button, IconButton, Link } from './controls';
import {
  Checkbox,
  CheckboxGroup,
  DateField,
  Form,
  FormItem,
  PhoneField,
  ReadOnlyField,
  SearchField,
  Select,
  TextArea,
  TextField,
} from './forms';

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

describe('controls and forms', () => {
  it('renders button variants and login sizing', () => {
    const onPress = jest.fn();
    const { getByTestId, rerender } = renderWithTheme(
      <>
        <Button testID="continue-button" onPress={onPress} login fullWidth>
          Continue
        </Button>
        <Button testID="icon-button" onPress={onPress} leadingIcon="check" trailingIcon="chevron-right" variant="danger">
          Submit
        </Button>
        <Button testID="plain-button" onPress={onPress}>
          Plain
        </Button>
        <Button testID="secondary-button" onPress={onPress} variant="secondary">
          Secondary
        </Button>
      </>,
    );

    const button = getByTestId('continue-button');
    const buttonStyle = typeof button.props.style === 'function' ? button.props.style({ pressed: false }) : button.props.style;
    expect(StyleSheet.flatten(buttonStyle)).toEqual(expect.objectContaining({ minHeight: 54 }));
    invokePressableStyle(button);
    const iconButton = getByTestId('icon-button');
    invokePressableStyle(iconButton);
    const plainButton = getByTestId('plain-button');
    invokePressableStyle(plainButton);
    const secondaryButton = getByTestId('secondary-button');
    invokePressableStyle(secondaryButton);
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(
      <ThemeProvider>
        <Button testID="continue-button" onPress={onPress} pending>
          Continue
        </Button>
      </ThemeProvider>,
    );
    expect(getByTestId('continue-button').props.accessibilityState).toEqual(expect.objectContaining({ busy: true }));
  });

  it('renders icon buttons and links', () => {
    const onIcon = jest.fn();
    const onLink = jest.fn();
    const { getByTestId, getByText } = renderWithTheme(
      <>
        <IconButton icon="edit" label="Edit item" onPress={onIcon} testID="edit-button" />
        <Link onPress={onLink} external>
          Learn more
        </Link>
      </>,
    );

    fireEvent.press(getByTestId('edit-button'));
    fireEvent.press(getByText('Learn more'));
    expect(onIcon).toHaveBeenCalledTimes(1);
    expect(onLink).toHaveBeenCalledTimes(1);
  });

  it('covers disabled icon buttons and plain links', () => {
    const onIcon = jest.fn();
    const { UNSAFE_getAllByType } = renderWithTheme(
      <>
        <IconButton icon="edit" label="Edit item" onPress={onIcon} testID="edit-button" pending />
        <IconButton icon="edit" label="Disabled item" onPress={onIcon} disabled />
        <Link accessibilityLabel="Internal link" onPress={onIcon}>
          Internal link
        </Link>
        <Link accessibilityLabel="Disabled link" disabled>
          Disabled link
        </Link>
      </>,
    );

    const pressables = UNSAFE_getAllByType(Pressable);
    const enabledButton = pressables.find((node) => node.props.accessibilityLabel === 'Edit item');
    const disabledButton = pressables.find((node) => node.props.accessibilityLabel === 'Disabled item');
    const internalLink = pressables.find((node) => node.props.accessibilityLabel === 'Internal link');
    const disabledLink = pressables.find((node) => node.props.accessibilityLabel === 'Disabled link');

    invokePressableStyle(enabledButton);
    invokePressableStyle(disabledButton);
    invokePressableStyle(internalLink);
    invokePressableStyle(disabledLink);
  });

  it('renders text fields and read only values', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByText } = renderWithTheme(
      <Form>
        <TextField label="Name" value="" onChangeText={onChange} helperText="Enter your name" />
        <TextField label="Code" testID="code-field" value="123" onChangeText={onChange} helperText="Digits only" errorText="Invalid" />
        <TextArea label="Bio" value="Hello" onChangeText={onChange} />
        <PhoneField label="Phone" value="" onChangeText={onChange} />
        <DateField label="Start date" value="2026-01-01" onChangeText={onChange} minDate="2026-01-01" maxDate="2026-12-31" />
        <ReadOnlyField label="Role" value="Coordinator" />
      </Form>,
    );

    fireEvent.changeText(getByLabelText('Name'), 'Alex');
    expect(onChange).toHaveBeenCalledWith('Alex');
    expect(getByText('Coordinator')).toBeTruthy();
  });

  it('renders search and select interactions', () => {
    const onSearchChange = jest.fn();
    const onClear = jest.fn();
    const onSelect = jest.fn();
    const { getByLabelText, getByText, getAllByText, queryByText, UNSAFE_getAllByType } = renderWithTheme(
      <>
        <SearchField
          label="Search"
          value="abc"
          onChangeText={onSearchChange}
          onClear={onClear}
          showNoResults
          noResultsText="Nothing matched"
        />
        <Select
          label="Skill"
          value="a"
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Bravo', disabled: true },
          ]}
          expanded
          onChange={onSelect}
        />
      </>,
    );

    fireEvent.press(getByLabelText('Clear Search'));
    fireEvent.press(getAllByText('Alpha')[0]);
    const alphaOption = getAllByText('Alpha')[1]?.parent;
    const bravoOption = getByText('Bravo').parent;
    const clearButton = getByLabelText('Clear Search');
    if (getAllByText('Alpha')[1]) {
      fireEvent.press(alphaOption ?? getAllByText('Alpha')[1]);
    }
    if (getByText('Bravo')) {
      fireEvent.press(getByText('Bravo'));
    }
    invokePressableStyle(alphaOption);
    invokePressableStyle(bravoOption);
    invokePressableStyle(clearButton);
    UNSAFE_getAllByType(Pressable)
      .filter((node) => node.props.accessibilityRole === 'button' && node.props.accessibilityState && Object.prototype.hasOwnProperty.call(node.props.accessibilityState, 'selected'))
      .forEach((node) => {
        invokePressableStyle(node);
      });
    UNSAFE_getAllByType(Pressable).forEach((node) => {
      invokePressableStyle(node);
    });
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(getByText('Nothing matched')).toBeTruthy();
    expect(getByLabelText('Search')).toBeTruthy();
  });

  it('covers search select and checkbox edge branches', () => {
    const onSearchChange = jest.fn();
    const onSelect = jest.fn();
    const onCheckbox = jest.fn();
    const { getByLabelText, queryByText } = renderWithTheme(
      <>
        <SearchField label="Empty search" value="" onChangeText={onSearchChange} />
        <Select
          label="Disabled plan"
          value="a"
          expanded
          errorText="Required"
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Bravo', disabled: true },
          ]}
          onChange={onSelect}
        />
        <Checkbox label="Disabled checkbox" checked={false} disabled onChange={onCheckbox} errorText="Unavailable" />
      </>,
    );

    expect(queryByText('No results found.')).toBeNull();
    expect(getByLabelText('Empty search')).toBeTruthy();
    const disabledPlan = getByLabelText('Disabled plan');
    if (typeof disabledPlan.props.style === 'function') {
      disabledPlan.props.style({ pressed: true });
      disabledPlan.props.style({ pressed: false });
    }
    expect(getByLabelText('Disabled checkbox')).toBeTruthy();
    const disabledCheckbox = getByLabelText('Disabled checkbox');
    if (typeof disabledCheckbox.props.style === 'function') {
      disabledCheckbox.props.style({ pressed: true });
    }
  });

  it('renders checkbox and checkbox groups', () => {
    const onChecked = jest.fn();
    const onGroup = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <>
        <Checkbox label="Agree" checked={false} onChange={onChecked} helperText="Required" />
        <CheckboxGroup
          label="Options"
          value={['one']}
          onChange={onGroup}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </>,
    );

    fireEvent.press(getByLabelText('Agree'));
    fireEvent.press(getByLabelText('Two'));
    expect(onChecked).toHaveBeenCalledWith(true);
    expect(onGroup).toHaveBeenCalledWith(['one', 'two']);
  });

  it('covers select date and checkbox group branches', () => {
    const onChange = jest.fn();
    const onGroupChange = jest.fn();
    const { getByLabelText, getByText, getAllByText, queryByText, UNSAFE_getAllByType } = renderWithTheme(
      <>
        <Select
          label="Locked plan"
          value=""
          disabled
          expanded
          errorText="Required"
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Bravo', disabled: true },
          ]}
          onChange={onChange}
        />
        <DateField
          label="Deadline"
          value="2026-01-01"
          onChangeText={onChange}
          helperText="Pick a date"
          minDate="2026-01-01"
          maxDate="2026-12-31"
        />
        <Checkbox label="Agree" checked required helperText="Required" errorText="Oops" disabled onChange={jest.fn()} />
        <CheckboxGroup
          label="Group"
          value={[]}
          required
          helperText="Group help"
          errorText="Group error"
          options={[
            { value: 'one', label: 'Option one' },
            { value: 'two', label: 'Option two', disabled: true },
          ]}
          onChange={onGroupChange}
        />
        <CheckboxGroup
          label="Group two"
          value={['one']}
          required
          helperText="Second group help"
          errorText="Second group error"
          options={[
            { value: 'one', label: 'Toggle one' },
            { value: 'two', label: 'Toggle two' },
          ]}
          onChange={onGroupChange}
        />
      </>,
    );

    invokePressableStyle(getByLabelText('Locked plan'));
    expect(getByText('Pick a date • Min 2026-01-01 • Max 2026-12-31')).toBeTruthy();
    expect(getAllByText('Required').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Group help')).toBeTruthy();
    expect(getByText('Group error')).toBeTruthy();

    fireEvent.press(getByLabelText('Option one'));
    fireEvent.press(getByLabelText('Option two'));
    fireEvent.press(getByLabelText('Option one'));
    fireEvent.press(getByLabelText('Toggle one'));
    UNSAFE_getAllByType(Pressable).forEach((node) => invokePressableStyle(node));

    expect(onGroupChange).toHaveBeenCalled();
    expect(queryByText('No results found.')).toBeNull();
  });
});
