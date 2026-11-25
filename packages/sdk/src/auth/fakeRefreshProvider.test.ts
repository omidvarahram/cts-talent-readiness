import { FakeRefreshProvider } from './fakeRefreshProvider';

describe('FakeRefreshProvider', () => {
  test('rotates fake refresh tokens and validates inputs', async () => {
    const provider = new FakeRefreshProvider(['a1', 'a2']);
    await expect(provider.refresh('refresh-1')).resolves.toEqual({
      accessToken: 'a1',
      refreshToken: 'refresh-1-rotated-1',
    });
    await expect(provider.refresh('refresh-1')).resolves.toEqual({
      accessToken: 'a2',
      refreshToken: 'refresh-1-rotated-2',
    });
    await expect(provider.refresh(null)).rejects.toThrow('Refresh token is required');
    await expect(provider.refresh('refresh-1')).rejects.toThrow('No fake refresh tokens remain');
  });

  test('returns null when the refresh token is unknown', async () => {
    const provider = new FakeRefreshProvider(['a1']);
    await expect(provider.refresh('missing')).resolves.toEqual({
      accessToken: 'a1',
      refreshToken: 'missing-rotated-1',
    });
  });

  test('supports the default constructor', async () => {
    const provider = new FakeRefreshProvider();
    await expect(provider.refresh('refresh-1')).resolves.toEqual({
      accessToken: 'refreshed-access-token',
      refreshToken: 'refresh-1-rotated-1',
    });
  });
});
