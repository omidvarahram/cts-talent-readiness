import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';
import { Box, Icon, Stack, Text } from './primitives';
import { useTheme } from '../theme/ThemeProvider';

type BaseFieldProps = {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  pending?: boolean;
  disabled?: boolean;
  testID?: string;
};

export type FormProps = ViewProps & {
  children: React.ReactNode;
};

export type FormItemProps = ViewProps &
  BaseFieldProps & {
    children: React.ReactNode;
  };

export type TextFieldProps = Omit<TextInputProps, 'onChange' | 'onChangeText' | 'value'> &
  BaseFieldProps & {
    value: string;
    onChangeText: (value: string) => void;
  };

export type ReadOnlyFieldProps = BaseFieldProps & {
  value: React.ReactNode;
};

export type TextAreaProps = TextFieldProps;

export type PhoneFieldProps = TextFieldProps;

export type SearchFieldProps = TextFieldProps & {
  onClear?: () => void;
  noResultsText?: string;
  showNoResults?: boolean;
};

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = BaseFieldProps & {
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  expanded?: boolean;
  onChange: (value: string) => void;
  onToggleExpanded?: () => void;
};

export type DateFieldProps = TextFieldProps & {
  minDate?: string;
  maxDate?: string;
};

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  required?: boolean;
  testID?: string;
};

export type CheckboxGroupProps = {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  required?: boolean;
};

export type FormSubmissionProps = ViewProps & {
  children: React.ReactNode;
};

function useFieldTone(errorText?: string, disabled?: boolean) {
  if (disabled) {
    return 'muted' as const;
  }
  if (errorText) {
    return 'danger' as const;
  }
  return 'default' as const;
}

function FieldMessage({
  helperText,
  errorText,
}: Pick<BaseFieldProps, 'helperText' | 'errorText'>) {
  return (
    <Stack spacing={2}>
      {helperText ? (
        <Text variant="caption" tone="muted">
          {helperText}
        </Text>
      ) : null}
      {errorText ? (
        <Text variant="caption" tone="danger" accessibilityRole="text">
          {errorText}
        </Text>
      ) : null}
    </Stack>
  );
}

export function Form({ children, style, ...rest }: FormProps) {
  return (
    <View {...rest} style={[{ width: '100%' }, style]}>
      {children}
    </View>
  );
}

export function FormItem({
  label,
  helperText,
  errorText,
  required,
  pending,
  disabled,
  children,
  style,
  testID,
  ...rest
}: FormItemProps) {
  const theme = useTheme();
  const tone = useFieldTone(errorText, disabled);
  return (
    <View
      testID={testID}
      {...rest}
      style={[
        { width: '100%', gap: theme.spacing.xs },
        style,
      ]}
    >
      <Stack spacing={4} direction="horizontal" align="center">
        <Text variant="label" weight="semibold" tone={tone}>
          {label}
        </Text>
        {required ? (
          <Text variant="caption" tone="danger">
            *
          </Text>
        ) : null}
        {pending ? (
          <Text variant="caption" tone="warning">
            Pending
          </Text>
        ) : null}
      </Stack>
      {children}
      <FieldMessage helperText={helperText} errorText={errorText} />
    </View>
  );
}

function textInputBaseStyle(theme: ReturnType<typeof useTheme>) {
  return {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    minHeight: theme.layout.touchTargetMin,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
  } as const;
}

export function TextField({
  label,
  helperText,
  errorText,
  required,
  pending,
  disabled,
  value,
  onChangeText,
  testID,
  style,
  accessibilityHint,
  editable,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const tone = useFieldTone(errorText, disabled);
  return (
    <FormItem
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      pending={pending}
      disabled={disabled}
      testID={testID}
    >
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        editable={editable ?? !disabled}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          textInputBaseStyle(theme),
          tone === 'danger' ? { borderColor: theme.colors.rejected } : null,
          disabled ? { backgroundColor: theme.colors.surfaceMuted, color: theme.colors.textMuted } : null,
          style,
        ]}
        {...rest}
      />
    </FormItem>
  );
}

export function ReadOnlyField({
  label,
  helperText,
  errorText,
  required,
  value,
  testID,
  ...rest
}: ReadOnlyFieldProps) {
  const theme = useTheme();
  return (
    <FormItem
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      testID={testID}
      {...rest}
    >
      <View
        accessibilityRole="text"
        style={{
          minHeight: theme.layout.touchTargetMin,
          justifyContent: 'center',
          borderWidth: 1,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surfaceMuted,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        }}
      >
        <Text>{value}</Text>
      </View>
    </FormItem>
  );
}

export function TextArea({ style, multiline = true, numberOfLines = 4, ...rest }: TextAreaProps) {
  return (
    <TextField
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[{ minHeight: 120, textAlignVertical: 'top' }, style]}
      {...rest}
    />
  );
}

export function PhoneField(props: PhoneFieldProps) {
  return <TextField keyboardType="phone-pad" textContentType="telephoneNumber" {...props} />;
}

export function SearchField({
  onClear,
  noResultsText = 'No results found.',
  showNoResults,
  style,
  ...rest
}: SearchFieldProps) {
  const theme = useTheme();
  return (
    <Stack spacing={theme.spacing.xs}>
      <View style={{ position: 'relative' }}>
        <TextField
          {...rest}
          autoCapitalize="none"
          autoCorrect={false}
          style={[{ paddingLeft: theme.spacing.xl + theme.spacing.sm, paddingRight: theme.spacing.xl }, style]}
        />
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: theme.spacing.sm, top: theme.spacing.md }}
        >
          <Icon name="search" decorative size={16} color={theme.colors.textMuted} />
        </View>
        {onClear && rest.value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${rest.label}`}
            hitSlop={8}
            onPress={onClear}
            style={({ pressed }) => [
              {
                position: 'absolute',
                right: theme.spacing.sm,
                top: theme.spacing.sm,
                minHeight: theme.layout.touchTargetMin,
                minWidth: theme.layout.touchTargetMin,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.65 : 1,
              },
            ]}
          >
            <Icon name="close" decorative size={14} color={theme.colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {showNoResults ? (
        <Text variant="caption" tone="muted">
          {noResultsText}
        </Text>
      ) : null}
    </Stack>
  );
}

export function Select({
  label,
  helperText,
  errorText,
  required,
  pending,
  disabled,
  value,
  placeholder = 'Select an option',
  options,
  expanded = false,
  onChange,
  onToggleExpanded,
}: SelectProps) {
  const theme = useTheme();
  const selected = options.find((option) => option.value === value);
  return (
    <FormItem
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      pending={pending}
      disabled={disabled}
    >
      <View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={selected ? selected.label : placeholder}
          onPress={disabled ? undefined : onToggleExpanded}
          disabled={disabled}
          style={({ pressed }) => [
            {
              minHeight: theme.layout.touchTargetMin,
              borderWidth: 1,
              borderRadius: theme.radius.md,
              borderColor: errorText ? theme.colors.rejected : theme.colors.border,
              backgroundColor: disabled ? theme.colors.surfaceMuted : theme.colors.surface,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text tone={selected ? 'default' : 'muted'}>{selected?.label ?? placeholder}</Text>
          <Icon name={expanded ? 'up' : 'down'} decorative size={14} color={theme.colors.textMuted} />
        </Pressable>
        {expanded ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              marginTop: theme.spacing.xs,
              overflow: 'hidden',
            }}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled: option.disabled || disabled }}
                  disabled={option.disabled || disabled}
                  onPress={() => onChange(option.value)}
                  style={({ pressed }) => [
                    {
                      minHeight: theme.layout.touchTargetMin,
                      paddingHorizontal: theme.spacing.md,
                      justifyContent: 'center',
                      backgroundColor: isSelected ? theme.colors.primarySubtle : theme.colors.surface,
                      borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                      borderTopColor: theme.colors.border,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text tone={option.disabled ? 'muted' : 'default'}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </FormItem>
  );
}

export function DateField({ minDate, maxDate, helperText, ...rest }: DateFieldProps) {
  const derivedHelper = [helperText, minDate ? `Min ${minDate}` : null, maxDate ? `Max ${maxDate}` : null]
    .filter(Boolean)
    .join(' • ');
  return (
    <TextField
      keyboardType="numbers-and-punctuation"
      autoCapitalize="none"
      autoCorrect={false}
      helperText={derivedHelper || undefined}
      placeholder="YYYY-MM-DD"
      {...rest}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  helperText,
  errorText,
  disabled,
  required,
  testID,
}: CheckboxProps) {
  const theme = useTheme();
  return (
    <Stack spacing={theme.spacing.xs}>
      <Pressable
        testID={testID}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        accessibilityLabel={label}
        onPress={disabled ? undefined : () => onChange(!checked)}
        style={({ pressed }) => [
          {
            minHeight: theme.layout.touchTargetMin,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: errorText ? theme.colors.rejected : theme.colors.border,
              backgroundColor: checked ? theme.colors.primary : theme.colors.surface,
            },
          ]}
        >
          {checked ? <Icon name="check" decorative size={12} color={theme.colors.textOnDark} /> : null}
        </View>
        <View style={{ flex: 1 }}>
          <Stack spacing={2} direction="horizontal" align="center">
            <Text>{label}</Text>
            {required ? <Text variant="caption" tone="danger">*</Text> : null}
          </Stack>
          {helperText ? <Text variant="caption" tone="muted">{helperText}</Text> : null}
          {errorText ? <Text variant="caption" tone="danger">{errorText}</Text> : null}
        </View>
      </Pressable>
    </Stack>
  );
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  helperText,
  errorText,
  disabled,
  required,
}: CheckboxGroupProps) {
  const toggle = (nextValue: string) => {
    const hasValue = value.includes(nextValue);
    onChange(hasValue ? value.filter((entry) => entry !== nextValue) : [...value, nextValue]);
  };

  return (
    <FormItem
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      disabled={disabled}
    >
      <Stack spacing={8}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            disabled={disabled || option.disabled}
            onChange={() => toggle(option.value)}
          />
        ))}
      </Stack>
    </FormItem>
  );
}
