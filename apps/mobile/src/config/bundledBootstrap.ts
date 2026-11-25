import { Platform } from 'react-native';

export const bundledBootstrap = {
  apiBaseUrl: Platform.select({
    android: 'http://10.0.2.2:3001',
    default: 'http://127.0.0.1:3001',
  }),
  topLevelReviewerAssociateId: 'top-reviewer',
  allowlistedHosts: ['127.0.0.1', '10.0.2.2', 'localhost'],
  pinningRequired: true,
} as const;
