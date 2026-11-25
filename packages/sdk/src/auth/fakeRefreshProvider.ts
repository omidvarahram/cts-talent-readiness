// @ts-nocheck
export interface FakeRefreshResult {
  accessToken: string;
  refreshToken: string | null;
}

/**
 * Fake refresh helper for tests only.
 * The dummy backend does not expose a real refresh endpoint.
 */
export class FakeRefreshProvider {
  private readonly sequence: string[];
  private index = 0;

  constructor(sequence: string[] = ['refreshed-access-token']) {
    this.sequence = [...sequence];
  }

  async refresh(currentRefreshToken: string | null): Promise<FakeRefreshResult> {
    if (!currentRefreshToken) {
      throw new Error('Refresh token is required');
    }
    if (this.index >= this.sequence.length) {
      throw new Error('No fake refresh tokens remain');
    }
    const accessToken = this.sequence[this.index++];
    return { accessToken, refreshToken: `${currentRefreshToken}-rotated-${this.index}` };
  }
}
