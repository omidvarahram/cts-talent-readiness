import React, { createContext, useContext, useMemo } from 'react';
import { tokens, type ThemeTokens } from './tokens';

export type Theme = ThemeTokens;

export type ThemeOverride = Partial<{
  colors: Partial<Record<keyof Theme['colors'], string>>;
  spacing: Partial<Record<keyof Theme['spacing'], number>>;
  radius: Partial<Record<keyof Theme['radius'], number>>;
  typography: Partial<{
    fontFamily: string;
    sizes: Partial<Record<keyof Theme['typography']['sizes'], number>>;
    lineHeights: Partial<Record<keyof Theme['typography']['lineHeights'], number>>;
    weights: Partial<Record<keyof Theme['typography']['weights'], '400' | '500' | '600' | '700' | string>>;
  }>;
  layout: Partial<Record<keyof Theme['layout'], number>>;
}>;

export type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: ThemeOverride;
};

const ThemeContext = createContext<Theme>(tokens);

function mergeTheme(base: Theme, override?: ThemeOverride): Theme {
  if (!override) {
    return base;
  }

  return {
    ...base,
    colors: { ...base.colors, ...(override.colors as Theme['colors'] | undefined) },
    spacing: { ...base.spacing, ...(override.spacing as Theme['spacing'] | undefined) },
    radius: { ...base.radius, ...(override.radius as Theme['radius'] | undefined) },
    typography: {
      ...base.typography,
      fontFamily: (override.typography?.fontFamily ?? base.typography.fontFamily) as Theme['typography']['fontFamily'],
      sizes: {
        ...base.typography.sizes,
        ...(override.typography?.sizes as Theme['typography']['sizes'] | undefined),
      },
      lineHeights: {
        ...base.typography.lineHeights,
        ...(override.typography?.lineHeights as Theme['typography']['lineHeights'] | undefined),
      },
      weights: {
        ...base.typography.weights,
        ...(override.typography?.weights as Theme['typography']['weights'] | undefined),
      },
    },
    layout: { ...base.layout, ...(override.layout as Theme['layout'] | undefined) },
  } as Theme;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const value = useMemo(() => mergeTheme(tokens, theme), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function useThemeColors() {
  return useTheme().colors;
}
