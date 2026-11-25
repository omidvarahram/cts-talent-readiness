import * as sdk from './index';

describe('package index', () => {
  test('re-exports the public surface', () => {
    expect(sdk.AuthManager).toBeDefined();
    expect(sdk.ConfigManager).toBeDefined();
    expect(sdk.JsonTransport).toBeDefined();
  });
});
