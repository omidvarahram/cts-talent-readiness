import { TransportError } from '../errors';
import { FakePinnedTransport, InsecureDevTransport } from './pinnedTransport';

describe('pinned transport helpers', () => {
  test('fake pinned transport enforces host allowlist', async () => {
    const transport = new FakePinnedTransport(['127.0.0.1'], {
      'GET /ok': { status: 200, body: { ok: true } },
      'GET /fail': { status: 500, body: { ok: false } },
    });

    await expect(transport.request('GET', '/ok')).resolves.toEqual({ ok: true });
    await expect(transport.request('GET', 'http://bad.example/ok')).rejects.toBeInstanceOf(TransportError);
    await expect(transport.request('GET', '/missing')).rejects.toBeInstanceOf(TransportError);
    await expect(transport.request('GET', '/fail')).rejects.toMatchObject({ code: 'HTTP_500' });
  });

  test('uses the default pinned host list', async () => {
    const transport = new FakePinnedTransport(undefined, {
      'GET /ok': { status: 200, body: { ok: true } },
    });

    await expect(transport.request('GET', '/ok')).resolves.toEqual({ ok: true });
  });

  test('constructs with defaults', () => {
    expect(new FakePinnedTransport()).toBeInstanceOf(FakePinnedTransport);
  });

  test('insecure dev transport delegates to json transport', async () => {
    const fetchImpl = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const transport = new InsecureDevTransport('http://example.com', fetchImpl as never);
    await expect(transport.request('GET', '/v1/ping')).resolves.toEqual({ ok: true });
  });
});
