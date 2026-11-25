export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id?: string;
  };
}

export class SdkError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    options: { cause?: unknown } = {},
  ) {
    super(message, options);
    this.name = 'SdkError';
  }
}

export class ValidationError extends SdkError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class TransportError extends SdkError {
  constructor(message: string, options: { cause?: unknown; code?: string } = {}) {
    super(message, options.code ?? 'TRANSPORT_ERROR', options);
    this.name = 'TransportError';
  }
}

export class TimeoutError extends TransportError {
  constructor(message = 'Request timed out') {
    super(message, { code: 'TIMEOUT' });
    this.name = 'TimeoutError';
  }
}

export class ApiError extends SdkError {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly requestId: string | null,
    public readonly errorCode: string,
    options: { cause?: unknown; body?: unknown } = {},
  ) {
    super(message, errorCode, options);
    this.name = 'ApiError';
    this.body = options.body;
  }

  public readonly body: unknown;
}

export class AuthError extends ApiError {
  constructor(message: string, statusCode = 401, requestId: string | null = null, errorCode = 'UNAUTHENTICATED') {
    super(message, statusCode, requestId, errorCode);
    this.name = 'AuthError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, requestId: string | null = null, errorCode = 'CONFLICT') {
    super(message, 409, requestId, errorCode);
    this.name = 'ConflictError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, requestId: string | null = null, errorCode = 'FORBIDDEN') {
    super(message, 403, requestId, errorCode);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, requestId: string | null = null, errorCode = 'NOT_FOUND') {
    super(message, 404, requestId, errorCode);
    this.name = 'NotFoundError';
  }
}

export class UnsupportedMediaTypeError extends ApiError {
  constructor(message: string, requestId: string | null = null, errorCode = 'UNSUPPORTED_MEDIA_TYPE') {
    super(message, 415, requestId, errorCode);
    this.name = 'UnsupportedMediaTypeError';
  }
}

export const isApiError = (value: unknown): value is ApiError =>
  value instanceof ApiError;

export function toApiError(
  statusCode: number,
  envelope: ApiErrorEnvelope | null,
  requestId: string | null,
  fallbackMessage: string,
  options: { cause?: unknown; body?: unknown } = {},
): ApiError {
  const code = envelope?.error.code ?? `HTTP_${statusCode}`;
  const message = envelope?.error.message ?? fallbackMessage;
  return new ApiError(message, statusCode, requestId, code, options);
}
