import { SdkError } from '../errors';
import type { Biometrics } from '../biometrics/biometrics';
import type { SecureStorage } from '../storage/secureStorage';

export interface NativeSecureStoreLike {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

export interface NativeLocalAuthLike {
  hasHardwareAsync(): Promise<boolean>;
  isEnrolledAsync(): Promise<boolean>;
  authenticateAsync(options?: { promptMessage?: string }): Promise<{ success: boolean }>;
  cancelAuthenticate?(): Promise<void> | void;
}

const peerMissing = (name: string) => new SdkError(`${name} peer is not installed`, 'PEER_MISSING');

export class SecureStoreAdapter implements SecureStorage {
  constructor(private readonly native: NativeSecureStoreLike | null = null) {}

  async getItem(key: string): Promise<string | null> {
    return (await this.ensureNative()).getItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await (await this.ensureNative()).setItemAsync(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await (await this.ensureNative()).deleteItemAsync(key);
  }

  async clear(): Promise<void> {
    throw peerMissing('expo-secure-store');
  }

  private async ensureNative(): Promise<NativeSecureStoreLike> {
    if (this.native) {
      return this.native;
    }
    throw peerMissing('expo-secure-store');
  }
}

export class LocalAuthBiometrics implements Biometrics {
  constructor(private readonly native: NativeLocalAuthLike | null = null) {}

  async isAvailable(): Promise<boolean> {
    const native = await this.ensureNative();
    return (await native.hasHardwareAsync()) && (await native.isEnrolledAsync());
  }

  async authenticate(prompt?: string): Promise<boolean> {
    const native = await this.ensureNative();
    return (await native.authenticateAsync({ promptMessage: prompt })).success;
  }

  async cancel(): Promise<void> {
    const native = await this.ensureNative();
    if (!native.cancelAuthenticate) {
      throw peerMissing('expo-local-authentication');
    }
    await native.cancelAuthenticate();
  }

  private async ensureNative(): Promise<NativeLocalAuthLike> {
    if (this.native) {
      return this.native;
    }
    throw peerMissing('expo-local-authentication');
  }
}
