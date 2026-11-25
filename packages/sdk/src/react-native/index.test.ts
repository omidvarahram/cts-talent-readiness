import { LocalAuthBiometrics, SecureStoreAdapter } from './index';

describe('react-native adapters', () => {
  test('use injectable peers', async () => {
    const store = new SecureStoreAdapter({
      getItemAsync: async (key) => (key === 'x' ? '1' : null),
      setItemAsync: async () => undefined,
      deleteItemAsync: async () => undefined,
    });
    await expect(store.getItem('x')).resolves.toBe('1');
    await expect(store.setItem('y', '2')).resolves.toBeUndefined();
    await expect(store.removeItem('y')).resolves.toBeUndefined();

    const biometrics = new LocalAuthBiometrics({
      hasHardwareAsync: async () => true,
      isEnrolledAsync: async () => true,
      authenticateAsync: async () => ({ success: true }),
      cancelAuthenticate: async () => undefined,
    });
    await expect(biometrics.isAvailable()).resolves.toBe(true);
    await expect(biometrics.authenticate('Unlock')).resolves.toBe(true);
    await expect(biometrics.cancel()).resolves.toBeUndefined();
  });

  test('throws when native peers are missing', async () => {
    const store = new SecureStoreAdapter();
    await expect(store.getItem('x')).rejects.toThrow('expo-secure-store peer is not installed');
    await expect(store.setItem('x', '1')).rejects.toThrow('expo-secure-store peer is not installed');
    await expect(store.removeItem('x')).rejects.toThrow('expo-secure-store peer is not installed');
    const biometrics = new LocalAuthBiometrics();
    await expect(biometrics.isAvailable()).rejects.toThrow('expo-local-authentication peer is not installed');
    await expect(biometrics.authenticate('Unlock')).rejects.toThrow('expo-local-authentication peer is not installed');
    await expect(biometrics.cancel()).rejects.toThrow('expo-local-authentication peer is not installed');
  });

  test('returns false when authentication is declined', async () => {
    const biometrics = new LocalAuthBiometrics({
      hasHardwareAsync: async () => true,
      isEnrolledAsync: async () => true,
      authenticateAsync: async () => ({ success: false }),
    });

    await expect(biometrics.authenticate('Unlock')).resolves.toBe(false);
  });

  test('supports clear and native cancel hooks', async () => {
    const store = new SecureStoreAdapter({
      getItemAsync: async () => null,
      setItemAsync: async () => undefined,
      deleteItemAsync: async () => undefined,
    });
    await expect(store.clear()).rejects.toThrow('expo-secure-store peer is not installed');

    const biometricsWithoutCancel = new LocalAuthBiometrics({
      hasHardwareAsync: async () => true,
      isEnrolledAsync: async () => true,
      authenticateAsync: async () => ({ success: true }),
    });
    await expect(biometricsWithoutCancel.cancel()).rejects.toThrow('expo-local-authentication peer is not installed');

    const cancelled = new LocalAuthBiometrics({
      hasHardwareAsync: async () => true,
      isEnrolledAsync: async () => true,
      authenticateAsync: async () => ({ success: true }),
      cancelAuthenticate: async () => undefined,
    });
    await expect(cancelled.cancel()).resolves.toBeUndefined();
  });
});
