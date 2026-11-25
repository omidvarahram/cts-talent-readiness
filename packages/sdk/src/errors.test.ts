import {
  ApiError,
  AuthError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  SdkError,
  TimeoutError,
  TransportError,
  UnsupportedMediaTypeError,
  isApiError,
  toApiError,
} from './errors';

describe('errors', () => {
  test('constructs the typed hierarchy', () => {
    const base = new SdkError('boom', 'BOOM');
    const transport = new TransportError('offline');
    const timeout = new TimeoutError();
    const api = new ApiError('bad request', 400, 'req-1', 'BAD', { body: { foo: 'bar' } });
    const auth = new AuthError('unauth');
    const conflict = new ConflictError('conflict');
    const forbidden = new ForbiddenError('forbidden');
    const notFound = new NotFoundError('missing');
    const unsupported = new UnsupportedMediaTypeError('type');

    expect(base).toBeInstanceOf(Error);
    expect(transport.code).toBe('TRANSPORT_ERROR');
    expect(timeout.code).toBe('TIMEOUT');
    expect(api.body).toEqual({ foo: 'bar' });
    expect(auth.statusCode).toBe(401);
    expect(conflict.statusCode).toBe(409);
    expect(forbidden.statusCode).toBe(403);
    expect(notFound.statusCode).toBe(404);
    expect(unsupported.statusCode).toBe(415);
    expect(isApiError(api)).toBe(true);
    expect(isApiError(base)).toBe(false);
  });

  test('maps an api envelope', () => {
    const api = toApiError(
      422,
      { error: { code: 'VALIDATION_ERROR', message: 'Nope', request_id: 'r-1' } },
      'r-1',
      'fallback',
      { body: { error: true } },
    );

    expect(api).toBeInstanceOf(ApiError);
    expect(api.statusCode).toBe(422);
    expect(api.requestId).toBe('r-1');
    expect(api.errorCode).toBe('VALIDATION_ERROR');
    expect(api.message).toBe('Nope');
  });

  test('uses fallback values when envelope is absent', () => {
    const api = toApiError(500, null, null, 'fallback');
    expect(api.errorCode).toBe('HTTP_500');
    expect(api.message).toBe('fallback');
  });
});
