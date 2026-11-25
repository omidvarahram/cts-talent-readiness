import { MemorySecureStorage } from './secureStorage';

describe('MemorySecureStorage', () => {
  test('stores, removes and clears values', async () => {
    const storage = new MemorySecureStorage();
    await storage.setItem('a', '1');
    await storage.setItem('b', '2');
    expect(await storage.getItem('a')).toBe('1');
    await storage.removeItem('a');
    expect(await storage.getItem('a')).toBeNull();
    expect(storage.snapshot()).toEqual({ b: '2' });
    await storage.clear();
    expect(storage.snapshot()).toEqual({});
  });
});
