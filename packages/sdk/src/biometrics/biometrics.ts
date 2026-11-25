import { SdkError } from '../errors';

export interface Biometrics {
  isAvailable(): Promise<boolean>;
  authenticate(prompt?: string): Promise<boolean>;
  cancel(): Promise<void>;
}

export class BiometricsCancelledError extends SdkError {
  constructor() {
    super('Biometric authentication was cancelled', 'BIOMETRIC_CANCELLED');
    this.name = 'BiometricsCancelledError';
  }
}

export class BiometricsLockoutError extends SdkError {
  constructor() {
    super('Biometric authentication is locked out', 'BIOMETRIC_LOCKOUT');
    this.name = 'BiometricsLockoutError';
  }
}

export class MemoryBiometrics implements Biometrics {
  private cancelled = false;

  constructor(
    private available = true,
    private enrolled = true,
    private lockedOut = false,
  ) {}

  async isAvailable(): Promise<boolean> {
    return this.available && this.enrolled && !this.lockedOut;
  }

  async authenticate(): Promise<boolean> {
    if (this.cancelled) {
      this.cancelled = false;
      throw new BiometricsCancelledError();
    }
    if (this.lockedOut) {
      throw new BiometricsLockoutError();
    }
    return this.available && this.enrolled;
  }

  async cancel(): Promise<void> {
    this.cancelled = true;
  }

  setAvailability(available: boolean): void {
    this.available = available;
  }

  setEnrollment(enrolled: boolean): void {
    this.enrolled = enrolled;
  }

  setLockedOut(lockedOut: boolean): void {
    this.lockedOut = lockedOut;
  }
}
