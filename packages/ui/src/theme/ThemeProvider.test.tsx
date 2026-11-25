import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../components/primitives';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeProbe() {
  const theme = useTheme();
  return <Text testID="theme-color">{theme.colors.primary}</Text>;
}

describe('ThemeProvider', () => {
  it('provides default tokens', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(getByTestId('theme-color').props.children).toBe('#246fc0');
  });

  it('merges theme overrides', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={{ colors: { primary: '#123456' } }}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(getByTestId('theme-color').props.children).toBe('#123456');
  });
});
