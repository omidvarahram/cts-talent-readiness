import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ImageStyle,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Box, Divider, Icon, Stack, Text } from './primitives';

type HeaderSlot = React.ReactNode;

export type AppHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: HeaderSlot;
  trailing?: HeaderSlot;
  safeAreaTop?: boolean;
};

export type AvatarProps = {
  name?: string;
  label?: string;
  uri?: string;
  size?: number;
  style?: ImageStyle;
};

export type CardProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export type StatusTone = 'approved' | 'pending' | 'rejected';

export type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  accessibilityLabel?: string;
};

export type InlineAlertProps = {
  title?: React.ReactNode;
  message: React.ReactNode;
  severity?: 'info' | 'success' | 'warning' | 'error';
  actionLabel?: string;
  onActionPress?: () => void;
  onClose?: () => void;
};

export type ProgressBarProps = {
  current: number;
  max: number;
  label?: string;
  pending?: number;
};

export type ProgressLabelProps = ProgressBarProps & {
  showPending?: boolean;
};

export type StepTimelineStep = {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export type StepTimelineProps = {
  steps: StepTimelineStep[];
  currentIndex: number;
};

export type BottomTabsItem = {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
};

export type BottomTabsProps = {
  items: BottomTabsItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export type DataTableColumn<T> = {
  key: string;
  title: React.ReactNode;
  width?: number;
  render: (row: T) => React.ReactNode;
  accessibilityLabel?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
  hint?: React.ReactNode;
};

export type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  widthRatio?: number;
  onOpenFocusRef?: React.RefObject<{ focus?: () => void } | null>;
  reduceMotion?: boolean;
  backdropDismissable?: boolean;
};

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  reduceMotion?: boolean;
};

export type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  reduceMotion?: boolean;
};

export type FilePickerFieldProps = {
  label: string;
  pending?: boolean;
  helperText?: string;
  onPick: () => void;
  testID?: string;
};

export type FileRowProps = {
  name: string;
  status?: 'selected' | 'uploading' | 'error' | 'complete';
  note?: string;
  onView?: () => void;
  onReplace?: () => void;
  onRemove?: () => void;
};

export type ImagePreviewProps = {
  uri?: string;
  label: string;
  fallbackLabel?: string;
  size?: number;
  loading?: boolean;
};

export type LoadingStateProps = {
  label?: React.ReactNode;
};

export type EmptyStateProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
};

export type ErrorStateProps = EmptyStateProps & {
  retryLabel?: string;
  onRetry?: () => void;
};

export type ToastProps = {
  visible: boolean;
  message: React.ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'error';
  onDismiss?: () => void;
};

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function percent(current: number, max: number) {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }
  return clampNumber((current / max) * 100, 0, 100);
}

function tonePalette(theme: ReturnType<typeof useTheme>, tone: StatusTone) {
  return {
    approved: {
      background: theme.colors.approvedSoft,
      border: theme.colors.approved,
      text: theme.colors.approved,
    },
    pending: {
      background: theme.colors.pendingSoft,
      border: theme.colors.pending,
      text: theme.colors.pending,
    },
    rejected: {
      background: theme.colors.rejectedSoft,
      border: theme.colors.rejected,
      text: theme.colors.rejected,
    },
  }[tone];
}

function severityPalette(theme: ReturnType<typeof useTheme>, severity: NonNullable<InlineAlertProps['severity']>) {
  return {
    info: tonePalette(theme, 'pending'),
    success: tonePalette(theme, 'approved'),
    warning: tonePalette(theme, 'pending'),
    error: tonePalette(theme, 'rejected'),
  }[severity];
}

function surfaceCard(theme: ReturnType<typeof useTheme>) {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  } as const;
}

export function AppHeader({ title, subtitle, leading, trailing, safeAreaTop = false }: AppHeaderProps) {
  const theme = useTheme();
  const content = (
    <View
      style={{
        backgroundColor: theme.colors.navy,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
      }}
    >
      <Stack direction="horizontal" spacing={theme.spacing.md} align="center" justify="space-between">
        <View style={{ flex: 1, minWidth: 0 }}>
          <Stack direction="horizontal" spacing={theme.spacing.sm} align="center">
            {leading}
            <View style={{ flex: 1 }}>
              <Text variant="subheading" tone="inverse" weight="semibold">
                {title}
              </Text>
              <Text variant="caption" tone="inverse">
                {subtitle}
              </Text>
            </View>
          </Stack>
        </View>
        <View>{trailing}</View>
      </Stack>
    </View>
  );
  if (!safeAreaTop) {
    return content;
  }
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.navy }}>
      {content}
    </SafeAreaView>
  );
}

export function Avatar({ name, label, uri, size = 48, style }: AvatarProps) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => {
    const source = name ?? label ?? '';
    const parts = source.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [label, name]);

  const showImage = Boolean(uri) && !failed;
  return (
    <View
      accessibilityLabel={label ?? name ?? 'Avatar'}
      accessibilityRole="image"
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primarySubtle,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          onError={() => setFailed(true)}
          style={{ width: size, height: size }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text weight="semibold" tone="primary">
          {initials}
        </Text>
      )}
    </View>
  );
}

export function Card({ title, subtitle, actions, footer, children }: CardProps) {
  const theme = useTheme();
  return (
    <View style={[surfaceCard(theme), { padding: theme.spacing.lg }]}>
      {(title || subtitle || actions) ? (
        <Stack direction="horizontal" spacing={theme.spacing.md} align="flex-start" justify="space-between">
          <View style={{ flex: 1 }}>
            {title ? <Text variant="subheading">{title}</Text> : null}
            {subtitle ? <Text variant="caption" tone="muted">{subtitle}</Text> : null}
          </View>
          {actions}
        </Stack>
      ) : null}
      {(title || subtitle || actions) ? <Box marginTop={theme.spacing.md}><Divider /></Box> : null}
      <View style={{ marginTop: title || subtitle || actions ? theme.spacing.md : 0 }}>{children}</View>
      {footer ? <View style={{ marginTop: theme.spacing.md }}>{footer}</View> : null}
    </View>
  );
}

export function StatusBadge({ label, tone, accessibilityLabel }: StatusBadgeProps) {
  const theme = useTheme();
  const palette = tonePalette(theme, tone);
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${label}`}
      style={{
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.pill,
        backgroundColor: palette.background,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text variant="caption" weight="semibold" tone={tone === 'rejected' ? 'danger' : tone === 'pending' ? 'warning' : 'success'}>
        {label}
      </Text>
    </View>
  );
}

export function InlineAlert({
  title,
  message,
  severity = 'info',
  actionLabel,
  onActionPress,
  onClose,
}: InlineAlertProps) {
  const theme = useTheme();
  const palette = severityPalette(theme, severity);
  return (
    <View
      accessibilityRole="alert"
      style={[
        surfaceCard(theme),
        {
          padding: theme.spacing.md,
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
      ]}
    >
      <Stack spacing={theme.spacing.sm}>
        <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" justify="space-between">
          <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" style={{ flex: 1 }}>
            <Icon
              name={severity === 'error' ? 'alert' : severity === 'success' ? 'check' : 'info'}
              decorative
              color={palette.text}
            />
            {title ? <Text weight="semibold">{title}</Text> : null}
          </Stack>
          {onClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss alert"
              hitSlop={8}
              onPress={onClose}
              style={{ minHeight: theme.layout.touchTargetMin, minWidth: theme.layout.touchTargetMin, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="close" decorative size={14} color={palette.text} />
            </Pressable>
          ) : null}
        </Stack>
        <Text>{message}</Text>
        {actionLabel && onActionPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onActionPress}
            style={{
              minHeight: theme.layout.touchTargetMin,
              alignSelf: 'flex-start',
              justifyContent: 'center',
              opacity: 1,
            }}
          >
            <Text tone="primary" weight="semibold">
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </Stack>
    </View>
  );
}

export function ProgressBar({ current, max, label, pending }: ProgressBarProps) {
  const theme = useTheme();
  const safeCurrent = clampNumber(current, 0, Math.max(max, 0));
  const safeMax = max > 0 ? max : 0;
  const valueNow = safeMax > 0 ? safeCurrent : 0;
  const fill = percent(valueNow, safeMax);
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: safeMax, now: valueNow }}>
      <View
        style={{
          height: 12,
          backgroundColor: theme.colors.primarySubtle,
          borderRadius: theme.radius.pill,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: `${fill}%`, height: '100%', backgroundColor: theme.colors.primary }} />
      </View>
      {pending != null ? (
        <Text variant="caption" tone="muted">
          Pending {pending}
        </Text>
      ) : null}
    </View>
  );
}

export function ProgressLabel({ current, max, label, pending, showPending = true }: ProgressLabelProps) {
  const approved = `${label ?? 'Progress'}: ${clampNumber(current, 0, Math.max(max, 0))}/${Math.max(max, 0)}`;
  return (
    <Stack spacing={4}>
      <Text weight="semibold">{approved}</Text>
      {showPending && pending != null ? <Text variant="caption" tone="muted">Pending {pending}</Text> : null}
    </Stack>
  );
}

export function StepTimeline({ steps, currentIndex }: StepTimelineProps) {
  const theme = useTheme();
  return (
    <Stack spacing={theme.spacing.sm}>
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'future';
        return (
          <Stack key={step.key} direction="horizontal" spacing={theme.spacing.md} align="flex-start">
            <View
              accessibilityRole="image"
              accessibilityLabel={`${step.title} ${state}`}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  state === 'current'
                    ? theme.colors.primary
                    : state === 'completed'
                      ? theme.colors.approved
                      : theme.colors.primarySubtle,
              }}
            >
              <Text tone={state === 'future' ? 'muted' : 'inverse'} weight="semibold" variant="caption">
                {index + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text weight={state === 'current' ? 'semibold' : 'regular'}>{step.title}</Text>
              {step.description ? <Text variant="caption" tone="muted">{step.description}</Text> : null}
            </View>
          </Stack>
        );
      })}
    </Stack>
  );
}

export function BottomTabs({ items, selectedKey, onSelect }: BottomTabsProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      {items.map((item) => {
        const selected = item.key === selectedKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: item.disabled }}
            accessibilityLabel={item.label}
            disabled={item.disabled}
            onPress={() => onSelect(item.key)}
            style={{
              flex: 1,
              minHeight: 56,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: theme.spacing.sm,
              opacity: 1,
              backgroundColor: selected ? theme.colors.primarySubtle : theme.colors.surface,
            }}
          >
            {item.icon ? <Icon name={item.icon} decorative color={selected ? theme.colors.primary : theme.colors.textMuted} /> : null}
            <Text variant="caption" tone={selected ? 'primary' : 'muted'}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function DataTable<T>({ columns, data, rowKey, emptyLabel = 'No data available', hint }: DataTableProps<T>) {
  const theme = useTheme();
  return (
    <View>
      {hint ? <Text variant="caption" tone="muted">{hint}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: '100%' }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
            {columns.map((column) => (
              <View key={column.key} style={{ width: column.width ?? 160, padding: theme.spacing.sm }}>
                <Text variant="caption" weight="semibold">
                  {column.title}
                </Text>
              </View>
            ))}
          </View>
          {data.length === 0 ? (
            <View style={{ padding: theme.spacing.md }}>
              <Text tone="muted">{emptyLabel}</Text>
            </View>
          ) : (
            data.map((row) => (
              <View key={rowKey(row)} style={{ flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }}>
                {columns.map((column) => (
                  <View key={column.key} style={{ width: column.width ?? 160, padding: theme.spacing.sm, justifyContent: 'center' }}>
                    {column.render(row)}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function useOverlayMotion(visible: boolean, reduceMotion = false) {
  const animated = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [present, setPresent] = useState(visible);

  useEffect(() => {
    setPresent(visible);
    animated.setValue(Number(visible));
  }, [animated, visible, reduceMotion]);

  return { animated, present };
}

export function SideDrawer({
  visible,
  onClose,
  title,
  children,
  widthRatio = 0.6,
  onOpenFocusRef,
  reduceMotion = false,
  backdropDismissable = true,
}: SideDrawerProps) {
  const theme = useTheme();
  const { animated, present } = useOverlayMotion(visible, reduceMotion);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (visible) {
      onOpenFocusRef?.current?.focus?.();
    }
  }, [onOpenFocusRef, visible]);

  if (!present) {
    return null;
  }

  const drawerWidth = width > 0 ? Math.round(width * widthRatio) : undefined;
  const translateX = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth ?? 320, 0],
  });

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <View style={{ flex: 1 }} onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss drawer"
          onPress={backdropDismissable ? onClose : undefined}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.backdrop },
          ]}
        />
        <Animated.View
          accessibilityRole="menu"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: drawerWidth ?? '60%',
            backgroundColor: theme.colors.drawer,
            transform: [{ translateX }],
            padding: theme.spacing.lg,
          }}
        >
          <Stack spacing={theme.spacing.md}>
            <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" justify="space-between">
              <Text variant="subheading" tone="inverse">{title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close drawer" onPress={onClose} hitSlop={8}>
                <Icon name="close" decorative color={theme.colors.textOnDark} />
              </Pressable>
            </Stack>
            {children}
          </Stack>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function BottomSheet({ visible, onClose, title, children, reduceMotion = false }: BottomSheetProps) {
  const theme = useTheme();
  const { animated, present } = useOverlayMotion(visible, reduceMotion);
  if (!present) {
    return null;
  }
  const translateY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });
  return (
    <Modal transparent visible onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss sheet" onPress={onClose} style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: theme.colors.backdrop }} />
        </Pressable>
        <Animated.View
          style={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius.lg,
            borderTopRightRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            transform: [{ translateY }],
          }}
        >
          <Stack spacing={theme.spacing.md}>
            <Stack direction="horizontal" justify="space-between" align="center">
              <Text variant="subheading">{title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close sheet" onPress={onClose} hitSlop={8}>
                <Icon name="close" decorative />
              </Pressable>
            </Stack>
            {children}
          </Stack>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function Dialog({ visible, onClose, title, children, reduceMotion = false }: DialogProps) {
  const theme = useTheme();
  const { animated, present } = useOverlayMotion(visible, reduceMotion);
  if (!present) {
    return null;
  }
  const opacity = animated;
  const scale = animated.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });
  return (
    <Modal transparent visible onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss dialog" onPress={onClose} style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: theme.colors.backdrop }} />
        </Pressable>
        <Animated.View
          style={{
            width: '88%',
            maxWidth: 420,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            opacity,
            transform: [{ scale }],
          }}
        >
          <Stack spacing={theme.spacing.md}>
            <Stack direction="horizontal" justify="space-between" align="center">
              <Text variant="subheading">{title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" onPress={onClose} hitSlop={8}>
                <Icon name="close" decorative />
              </Pressable>
            </Stack>
            {children}
          </Stack>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function FilePickerField({ label, pending, helperText, onPick, testID }: FilePickerFieldProps) {
  const theme = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPick}
      style={({ pressed }) => [
        {
          minHeight: theme.layout.touchTargetMin,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Stack spacing={4}>
        <Stack direction="horizontal" spacing={theme.spacing.sm} align="center">
          <Icon name="upload" decorative />
          <Text weight="semibold">{label}</Text>
          {pending ? <Text variant="caption" tone="warning">Pending</Text> : null}
        </Stack>
        {helperText ? <Text variant="caption" tone="muted">{helperText}</Text> : null}
      </Stack>
    </Pressable>
  );
}

export function FileRow({ name, status = 'selected', note, onView, onReplace, onRemove }: FileRowProps) {
  const theme = useTheme();
  const statusLabel = {
    selected: 'Selected',
    uploading: 'Uploading',
    error: 'Error',
    complete: 'Complete',
  }[status];
  return (
    <View style={[surfaceCard(theme), { padding: theme.spacing.md }]}>
      <Stack spacing={theme.spacing.sm}>
        <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" justify="space-between">
          <Stack direction="horizontal" spacing={theme.spacing.sm} align="center" style={{ flex: 1 }}>
            <Icon name="file" decorative />
            <View style={{ flex: 1 }}>
              <Text weight="semibold">{name}</Text>
              {/* istanbul ignore next */}
              {note ? <Text variant="caption" tone="muted">{note}</Text> : null}
            </View>
          </Stack>
          <StatusBadge label={statusLabel} tone={status === 'complete' ? 'approved' : status === 'error' ? 'rejected' : 'pending'} />
        </Stack>
        <Stack direction="horizontal" spacing={theme.spacing.md} wrap>
          {onView ? <ActionText label="View" onPress={onView} /> : null}
          {onReplace ? <ActionText label="Replace" onPress={onReplace} /> : null}
          {onRemove ? <ActionText label="Remove" onPress={onRemove} /> : null}
        </Stack>
      </Stack>
    </View>
  );
}

function ActionText({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={8} style={{ minHeight: theme.layout.touchTargetMin, justifyContent: 'center' }}>
      <Text tone="primary" weight="semibold">
        {label}
      </Text>
    </Pressable>
  );
}

export function ImagePreview({ uri, label, fallbackLabel, size = 120, loading }: ImagePreviewProps) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{
        width: size,
        height: size,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        backgroundColor: theme.colors.primarySubtle,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showImage ? (
        <Image source={{ uri }} onError={() => setFailed(true)} style={{ width: size, height: size }} />
      ) : (
        <Text weight="semibold" tone="primary">
          {fallbackLabel ?? label}
        </Text>
      )}
      {loading ? (
        <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.backdrop }]}>
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  const theme = useTheme();
  return (
    <Stack spacing={theme.spacing.sm} align="center">
      <ActivityIndicator />
      <Text tone="muted">{label}</Text>
    </Stack>
  );
}

export function EmptyState({ title, description, actionLabel, onActionPress }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <Box padding={theme.spacing.xl} style={{ alignItems: 'center' }}>
      <Stack spacing={theme.spacing.md} align="center">
        <Icon name="image" decorative size={28} color={theme.colors.textMuted} />
        <Text variant="subheading">{title}</Text>
        {description ? <Text tone="muted" style={{ textAlign: 'center' }}>{description}</Text> : null}
        {actionLabel && onActionPress ? <ActionText label={actionLabel} onPress={onActionPress} /> : null}
      </Stack>
    </Box>
  );
}

export function ErrorState({ title, description, actionLabel, onActionPress, retryLabel = 'Retry', onRetry }: ErrorStateProps) {
  return (
    <InlineAlert
      severity="error"
      title={title}
      message={description ?? 'Something went wrong.'}
      actionLabel={actionLabel ?? retryLabel}
      onActionPress={onActionPress ?? onRetry}
    />
  );
}

export function Toast({ visible, message, tone = 'info', onDismiss }: ToastProps) {
  const theme = useTheme();
  /* istanbul ignore next */
  if (!visible) {
    return null;
  }
  const palette = severityPalette(theme, tone === 'info' ? 'warning' : tone);
  return (
    <View
      style={{
        position: 'absolute',
        left: theme.spacing.md,
        right: theme.spacing.md,
        bottom: theme.spacing.xl,
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        backgroundColor: palette.background,
        borderColor: palette.border,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text>{message}</Text>
      {/* istanbul ignore next */}
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss toast" onPress={onDismiss} hitSlop={8}>
          <Icon name="close" decorative />
        </Pressable>
      ) : null}
    </View>
  );
}
