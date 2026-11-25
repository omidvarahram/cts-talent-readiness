import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export type TextVariant = 'body' | 'heading' | 'subheading' | 'label' | 'caption' | 'error';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: 'default' | 'muted' | 'inverse' | 'primary' | 'success' | 'warning' | 'danger';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

const iconMap: Record<string, string> = {
  add: '+',
  alert: '!',
  arrowLeft: '‹',
  arrowRight: '›',
  calendar: '◷',
  check: '✓',
  close: '×',
  down: '⌄',
  edit: '✎',
  file: '▣',
  image: '◫',
  info: 'i',
  link: '↗',
  menu: '☰',
  minus: '−',
  phone: '☎',
  search: '⌕',
  up: '⌃',
  upload: '⇪',
  user: '◉',
  warning: '⚠',
  eye: '◔',
};

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  label?: string;
  decorative?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

type SpacingValue = number | `${number}%`;

type BoxProps = ViewProps & {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  width?: SpacingValue;
  minWidth?: SpacingValue;
  maxWidth?: SpacingValue;
  minHeight?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  flex?: number;
  flexDirection?: ViewStyle['flexDirection'];
};

type StackProps = ViewProps & {
  direction?: 'vertical' | 'horizontal';
  spacing?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  reverse?: boolean;
};

type DividerProps = ViewProps & {
  inset?: number;
  orientation?: 'horizontal' | 'vertical';
};

type ScreenContainerProps = ViewProps & {
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeAreaEdges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

type SectionHeaderProps = ViewProps & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  onActionPress?: () => void;
  actionLabel?: string;
};

export function Text({
  variant = 'body',
  tone = 'default',
  weight,
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const colorByTone = {
    default: theme.colors.text,
    muted: theme.colors.textMuted,
    inverse: theme.colors.textOnDark,
    primary: theme.colors.primary,
    success: theme.colors.approved,
    warning: theme.colors.pending,
    danger: theme.colors.rejected,
  } as const;
  const sizeByVariant = {
    body: theme.typography.sizes.md,
    heading: theme.typography.sizes.xxl,
    subheading: theme.typography.sizes.xl,
    label: theme.typography.sizes.sm,
    caption: theme.typography.sizes.xs,
    error: theme.typography.sizes.sm,
  } as const;
  const lineHeightByVariant = {
    body: theme.typography.lineHeights.md,
    heading: theme.typography.lineHeights.xxl,
    subheading: theme.typography.lineHeights.xl,
    label: theme.typography.lineHeights.sm,
    caption: theme.typography.lineHeights.sm,
    error: theme.typography.lineHeights.sm,
  } as const;
  const resolvedWeight =
    weight ??
    (variant === 'heading' || variant === 'subheading' ? 'semibold' : 'regular');

  return (
    <RNText
      {...rest}
      style={[
        {
          color: colorByTone[tone],
          fontFamily: theme.typography.fontFamily,
          fontSize: sizeByVariant[variant],
          lineHeight: lineHeightByVariant[variant],
          fontWeight: theme.typography.weights[resolvedWeight],
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

export function Icon({
  name,
  size = 18,
  color,
  label,
  decorative = true,
  style,
  testID,
}: IconProps) {
  const theme = useTheme();
  const glyph = iconMap[name] ?? '?';
  const resolvedColor = color ?? theme.colors.text;

  return (
    <RNText
      testID={testID}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label ?? name}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      accessibilityElementsHidden={decorative}
      style={[
        {
          color: resolvedColor,
          fontFamily: theme.typography.fontFamily,
          fontSize: size,
          lineHeight: size * 1.1,
          textAlign: 'center',
          minWidth: size,
          minHeight: size,
        },
        style,
      ]}
    >
      {glyph}
    </RNText>
  );
}

export function Box({
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  width,
  minWidth,
  maxWidth,
  minHeight,
  alignItems,
  justifyContent,
  flex,
  flexDirection,
  style,
  children,
  ...rest
}: BoxProps) {
  return (
    <View
      {...rest}
      style={[
        {
          padding,
          paddingHorizontal,
          paddingVertical,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          margin,
          marginHorizontal,
          marginVertical,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          backgroundColor,
          borderRadius,
          borderWidth,
          borderColor,
          width,
          minWidth,
          maxWidth,
          minHeight,
          alignItems,
          justifyContent,
          flex,
          flexDirection,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Stack({
  direction = 'vertical',
  spacing = 0,
  align,
  justify,
  wrap = false,
  reverse = false,
  style,
  children,
  ...rest
}: StackProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  const ordered = reverse ? items.reverse() : items;
  const horizontal = direction === 'horizontal';
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: horizontal ? 'row' : 'column',
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
    >
      {ordered.map((child, index) => {
        const isLast = index === ordered.length - 1;
        const marginStyle: ViewStyle = horizontal
          ? reverse
            ? { marginLeft: isLast ? 0 : spacing }
            : { marginRight: isLast ? 0 : spacing }
          : reverse
            ? { marginTop: isLast ? 0 : spacing }
            : { marginBottom: isLast ? 0 : spacing };

        return (
          <View key={(child as React.ReactElement).key ?? index} style={marginStyle}>
            {child}
          </View>
        );
      })}
    </View>
  );
}

export function Divider({
  inset = 0,
  orientation = 'horizontal',
  style,
  ...rest
}: DividerProps) {
  const theme = useTheme();
  const isHorizontal = orientation === 'horizontal';
  return (
    <View
      {...rest}
      accessibilityLabel="Separator"
      accessible
      style={[
        {
          backgroundColor: theme.colors.border,
          opacity: 0.7,
          marginLeft: isHorizontal ? inset : 0,
          marginRight: isHorizontal ? inset : 0,
          marginTop: isHorizontal ? 0 : inset,
          marginBottom: isHorizontal ? 0 : inset,
          height: isHorizontal ? theme.layout.dividerWidth : '100%',
          width: isHorizontal ? '100%' : theme.layout.dividerWidth,
        },
        style,
      ]}
    />
  );
}

export function ScreenContainer({
  scrollable = false,
  keyboardAvoiding = true,
  safeAreaEdges,
  contentStyle,
  children,
  style,
  ...rest
}: ScreenContainerProps) {
  const theme = useTheme();
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        {
          flexGrow: 1,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.pageBackground,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        {
          flex: 1,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.pageBackground,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[{ flex: 1, backgroundColor: theme.colors.pageBackground }, style]}
      {...rest}
    >
      {wrapped}
    </SafeAreaView>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  onActionPress,
  actionLabel = 'Action',
  style,
  ...rest
}: SectionHeaderProps) {
  const theme = useTheme();
  const actionNode =
    action ?? onActionPress ? (
      <Pressable
        onPress={onActionPress}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        hitSlop={8}
        style={({ pressed }) => [
          {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            minHeight: theme.layout.touchTargetMin,
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {action ?? <Text tone="primary">{actionLabel}</Text>}
      </Pressable>
    ) : null;

  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="subheading" weight="semibold">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionNode}
    </View>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { styles as primitiveStyles };
