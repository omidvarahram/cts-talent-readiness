import React from 'react';
import { render } from '@testing-library/react-native';

import App from './App';

jest.mock('./src/services/AppServicesContext', () => ({
  AppServicesProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('./src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));

it('renders the app shell', () => {
  render(<App />);
});
