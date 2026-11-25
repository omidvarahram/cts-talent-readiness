// @ts-nocheck
import { TimeoutError, TransportError } from '../errors';
import { JsonTransport } from './transport';

describe('JsonTransport', () => {
  test('sends json and parses success responses', async () => {
    const fetchImpl = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const transport = new JsonTransport('http://example.com', fetchImpl as never, 1000);
    const signal = new AbortController().signal;

    await expect(
      transport.request('POST', '/v1/demo', {
        body: { a: 1 },
        headers: { 'x-demo': '1' },
        signal,
      }),
    ).resolves.toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-demo': '1',
        }),
        body: JSON.stringify({ a: 1 }),
      }),
    );
  });

  test('skips timeout handling when disabled', async () => {
    const fetchImpl = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const transport = new JsonTransport('http://example.com', fetchImpl as never, 1000);

    await expect(transport.request('GET', '/v1/demo', { timeoutMs: 0 })).resolves.toEqual({ ok: true });
  });

  test('uses the default timeout setting', async () => {
    const fetchImpl = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const transport = new JsonTransport('http://example.com', fetchImpl as never);

    await expect(transport.request('GET', '/v1/demo')).resolves.toEqual({ ok: true });
  });

  test('maps error responses to api errors', async () => {
    const fetchImpl = jest.fn(async () =>
      new Response(JSON.stringify({ error: { code: 'NOPE', message: 'Denied', request_id: 'req-1' } }), {
        status: 403,
        headers: { 'x-request-id': 'req-1' },
      }),
    );
    const transport = new JsonTransport('http://example.com', fetchImpl as never, 1000);

    await expect(transport.request('GET', '/v1/demo')).rejects.toMatchObject({
      statusCode: 403,
      errorCode: 'NOPE',
      requestId: 'req-1',
    });
  });

  test('handles no content, empty bodies, invalid json, aborts and timeouts', async () => {
    const noContent = new JsonTransport('http://example.com', jest.fn(async () => new Response(null, { status: 204 })) as never);
    await expect(noContent.request('DELETE', '/v1/demo')).resolves.toBeUndefined();

    const emptyBody = new JsonTransport('http://example.com', jest.fn(async () => new Response('', { status: 200 })) as never);
    await expect(emptyBody.request('GET', '/v1/demo')).resolves.toBeUndefined();

    const invalid = new JsonTransport('http://example.com', jest.fn(async () => new Response('not json', { status: 200 })) as never);
    await expect(invalid.request('GET', '/v1/demo')).rejects.toBeInstanceOf(TransportError);

    const abortController = new AbortController();
    abortController.abort('stop');
    await expect(
      new JsonTransport('http://example.com', jest.fn() as never).request('GET', '/v1/demo', { signal: abortController.signal }),
    ).rejects.toMatchObject({ code: 'ABORTED' });

    await expect(
      new JsonTransport(
        'http://example.com',
        jest.fn(async () => {
          throw new Error('offline');
        }) as never,
        1000,
      ).request('GET', '/v1/demo'),
    ).rejects.toMatchObject({ message: 'Network request failed' });

    jest.useFakeTimers();
    const hanging = new JsonTransport(
      'http://example.com',
      ((_, init) =>
        new Promise<Response>((_, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        })) as never,
      1,
    );
    const timeoutPromise = hanging.request('GET', '/v1/demo');
    const timeoutExpectation = expect(timeoutPromise).rejects.toBeInstanceOf(TimeoutError);
    await jest.advanceTimersByTimeAsync(2);
    await timeoutExpectation;
    jest.useRealTimers();
  });

  test('bridges active abort reasons into the transport abort path', async () => {
    const fetchImpl = jest.fn(
      async (_url, init) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const transport = new JsonTransport('http://example.com', fetchImpl as never, 1000);

    const withReason = new AbortController();
    const withReasonPromise = transport.request('GET', '/v1/demo', { signal: withReason.signal });
    withReason.abort('stop');
    await expect(withReasonPromise).rejects.toBeInstanceOf(TimeoutError);

    const undefinedReasonSignal = (() => {
      let onAbort: (() => void) | undefined;
      return {
        aborted: false,
        reason: undefined,
        addEventListener: (_event: string, listener: () => void) => {
          onAbort = listener;
        },
        removeEventListener: () => {
          onAbort = undefined;
        },
        triggerAbort: () => {
          onAbort?.();
        },
      };
    })();
    const withoutReasonPromise = transport.request('GET', '/v1/demo', { signal: undefinedReasonSignal as never });
    undefinedReasonSignal.triggerAbort();
    await expect(withoutReasonPromise).rejects.toBeInstanceOf(TimeoutError);
  });
});
