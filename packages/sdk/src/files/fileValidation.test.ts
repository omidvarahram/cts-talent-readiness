import { ValidationError } from '../errors';
import { getUploadLimit, validateFileUpload } from './fileValidation';

describe('fileValidation', () => {
  test('accepts valid uploads and exposes limits', () => {
    expect(getUploadLimit('avatar')).toBe(5 * 1024 * 1024);
    expect(getUploadLimit('skillEvidence')).toBe(10 * 1024 * 1024);
    expect(() =>
      validateFileUpload({ purpose: 'cv', name: 'cv.pdf', mimeType: 'application/pdf', sizeBytes: 1024 }),
    ).not.toThrow();
    expect(() =>
      validateFileUpload({ purpose: 'skillEvidence', name: 'evidence.pdf', mimeType: 'application/pdf', sizeBytes: 1024 }),
    ).not.toThrow();
  });

  test('rejects invalid uploads', () => {
    expect(() =>
      validateFileUpload({ purpose: 'avatar', name: 'avatar.png', mimeType: 'image/png', sizeBytes: 0 }),
    ).toThrow(ValidationError);
    expect(() =>
      validateFileUpload({ purpose: 'cv', name: 'cv.txt', mimeType: 'text/plain', sizeBytes: 1024 }),
    ).toThrow(ValidationError);
    expect(() =>
      validateFileUpload({ purpose: 'avatar', name: 'avatar.png', mimeType: 'image/png', sizeBytes: 6 * 1024 * 1024 }),
    ).toThrow(ValidationError);
  });
});
