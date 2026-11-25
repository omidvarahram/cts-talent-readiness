import { BiometricsCancelledError, BiometricsLockoutError, MemoryBiometrics } from './biometrics';

describe('MemoryBiometrics', () => {
  test('reports availability and authenticates', async () => {
    const biometrics = new MemoryBiometrics(true, true, false);
    await expect(biometrics.isAvailable()).resolves.toBe(true);
    await expect(biometrics.authenticate()).resolves.toBe(true);
  });

  test('returns false when unavailable or unenrolled', async () => {
    await expect(new MemoryBiometrics(false, true, false).isAvailable()).resolves.toBe(false);
    await expect(new MemoryBiometrics(true, false, false).isAvailable()).resolves.toBe(false);
  });

  test('handles cancel and lockout', async () => {
    const biometrics = new MemoryBiometrics(true, true, false);
    await biometrics.cancel();
    await expect(biometrics.authenticate()).rejects.toBeInstanceOf(BiometricsCancelledError);

    biometrics.setLockedOut(true);
    await expect(biometrics.authenticate()).rejects.toBeInstanceOf(BiometricsLockoutError);
    await expect(biometrics.isAvailable()).resolves.toBe(false);
  });

  test('updates availability and enrollment flags', async () => {
    const biometrics = new MemoryBiometrics(false, false, true);
    expect(await biometrics.isAvailable()).toBe(false);
    biometrics.setAvailability(true);
    biometrics.setEnrollment(true);
    biometrics.setLockedOut(false);
    expect(await biometrics.isAvailable()).toBe(true);
    await expect(biometrics.authenticate()).resolves.toBe(true);
  });

  test('returns false when enrollment is missing', async () => {
    const biometrics = new MemoryBiometrics(true, false, false);
    expect(await biometrics.isAvailable()).toBe(false);
    await expect(biometrics.authenticate()).resolves.toBe(false);
  });

  test('uses default constructor values', async () => {
    const biometrics = new MemoryBiometrics();
    expect(await biometrics.isAvailable()).toBe(true);
    await expect(biometrics.authenticate()).resolves.toBe(true);
  });
});
