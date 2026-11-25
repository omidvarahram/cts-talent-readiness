import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Box, Icon, Stack, Text } from './primitives';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text';

export type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  pending?: boolean;
  disabled?: boolean;
  login?: boolean;
  accessibilityLabel?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export type IconButtonProps = {
  icon: string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  pending?: boolean;
  testID?: string;
};

export type LinkProps = {
  children: React.ReactNode;
  onPress?: () => void;
  external?: boolean;
  accessibilityLabel?: string;
  disabled?: boolean;
};

function paletteForVariant(theme: ReturnType<typeof useTheme>, variant: ButtonVariant) {
  return {
    primary: {
      background: theme.colors.primary,
      text: theme.colors.textOnDark,
      border: theme.colors.primary,
    },
    secondary: {
      background: theme.colors.surface,
      text: theme.colors.primary,
      border: theme.colors.primary,
    },
    ghost: {
      background: 'transparent',
      text: theme.colors.primary,
      border: 'transparent',
    },
    danger: {
      background: theme.colors.rejected,
      text: theme.colors.textOnDark,
      border: theme.colors.rejected,
    },
    text: {
      background: 'transparent',
      text: theme.colors.primary,
      border: 'transparent',
    },
  }[variant];
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  fullWidth = false,
  pending = false,
  disabled = false,
  login = false,
  accessibilityLabel,
  leadingIcon,
  trailingIcon,
  testID,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const palette = paletteForVariant(theme, variant);
  const isDisabled = disabled || pending || !onPress;
  const minHeight = login ? theme.layout.loginButtonMinHeight : theme.layout.touchTargetMin;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: pending }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={[
        {
          minHeight,
          minWidth: theme.layout.touchTargetMin,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.background,
          alignItems: 'center',
          justifyContent: 'center',
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" justify="center">
        {/* istanbul ignore next */}
        {pending ? <ActivityIndicator color={palette.text} /> : leadingIcon ? <Icon name={leadingIcon} decorative color={palette.text} /> : null}
        <Text weight="semibold" tone={variant === 'primary' || variant === 'danger' ? 'inverse' : 'primary'}>
          {children}
        </Text>
        {trailingIcon ? <Icon name={trailingIcon} decorative color={palette.text} /> : null}
      </Stack>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, disabled = false, pending = false, testID }: IconButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || pending || !onPress;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: pending }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={{
        minHeight: theme.layout.touchTargetMin,
        minWidth: theme.layout.touchTargetMin,
        borderRadius: theme.radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDisabled ? 0.7 : 1,
        backgroundColor: theme.colors.primarySubtle,
      }}
    >
      {pending ? <ActivityIndicator size="small" /> : <Icon name={icon} decorative color={theme.colors.primary} />}
    </Pressable>
  );
}

export function Link({ children, onPress, external, accessibilityLabel, disabled }: LinkProps) {
  const theme = useTheme();
  const isDisabled = disabled || !onPress;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={{
        minHeight: theme.layout.touchTargetMin,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        opacity: isDisabled ? 0.75 : 1,
      }}
    >
      <Stack direction="horizontal" spacing={theme.spacing.xs} align="center">
        <Text tone="primary" weight="semibold" style={{ textDecorationLine: 'underline' }}>
          {children}
        </Text>
        {external ? <Icon name="link" decorative size={14} color={theme.colors.primary} /> : null}
      </Stack>
    </Pressable>
  );
}

export { Box, Icon, Stack, Text };
