import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@cts-talent/ui';

import { AppServicesProvider } from './src/services/AppServicesContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppServicesProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AppServicesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

