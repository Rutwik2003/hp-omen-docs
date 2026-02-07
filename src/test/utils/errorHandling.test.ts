import { describe, expect, it } from 'vitest';
import { createErrorResponse, parseError } from '../../utils/errorHandling';

describe('parseError', () => {
  describe('network errors', () => {
    it('categorizes "Failed to fetch" as a network error', () => {
      const result = parseError(new TypeError('Failed to fetch'));
      expect(result.category).toBe('network');
      expect(result.title).toBe('Connection Failed');
      expect(result.recoverable).toBe(true);
    });

    it('categorizes timeout errors', () => {
      const result = parseError(new Error('Request timeout'));
      expect(result.category).toBe('network');
      expect(result.title).toBe('Request Timeout');
    });

    it('categorizes CORS errors', () => {
      const result = parseError(new Error('CORS policy blocked'));
      expect(result.category).toBe('network');
    });
  });

  describe('storage errors', () => {
    it('categorizes QuotaExceededError', () => {
      const error = new DOMException('Quota exceeded', 'QuotaExceededError');
      const result = parseError(error);
      expect(result.category).toBe('storage');
      expect(result.title).toBe('Storage Full');
      expect(result.recoverable).toBe(true);
    });

    it('categorizes IndexedDB errors', () => {
      const result = parseError(new Error('IndexedDB connection failed'));
      expect(result.category).toBe('storage');
    });
  });

  describe('auth errors', () => {
    it('categorizes 401 errors', () => {
      const result = parseError(new Error('401 Unauthorized'));
      expect(result.category).toBe('auth');
      expect(result.recoverable).toBe(false);
    });

    it('categorizes 403 errors', () => {
      const result = parseError(new Error('403 Forbidden'));
      expect(result.category).toBe('auth');
      expect(result.recoverable).toBe(false);
    });

    it('categorizes password errors', () => {
      const result = parseError(new Error('invalid_password'));
      expect(result.category).toBe('auth');
    });
  });

  describe('content errors', () => {
    it('categorizes 404 errors', () => {
      const result = parseError(new Error('404 Not Found'));
      expect(result.category).toBe('content');
      expect(result.recoverable).toBe(false);
    });

    it('categorizes parse errors', () => {
      const result = parseError(new Error('JSON parse error'));
      expect(result.category).toBe('content');
    });
  });

  describe('validation errors', () => {
    it('categorizes validation errors', () => {
      const result = parseError(new Error('Field is required'));
      expect(result.category).toBe('validation');
      expect(result.recoverable).toBe(true);
    });

    it('categorizes missing field errors', () => {
      const result = parseError(new Error('missing title'));
      expect(result.category).toBe('validation');
    });
  });

  describe('unknown errors', () => {
    it('defaults to unknown category', () => {
      const result = parseError(new Error('Something completely unexpected'));
      expect(result.category).toBe('unknown');
      expect(result.title).toBe('Something Went Wrong');
      expect(result.recoverable).toBe(true);
    });

    it('handles non-Error objects', () => {
      const result = parseError('string error');
      expect(result.original).toBe('string error');
      expect(result.title).toBe('Something Went Wrong');
    });

    it('handles null/undefined errors', () => {
      const result = parseError(null);
      expect(result.category).toBe('unknown');
    });
  });

  describe('context parameter', () => {
    it('includes context in the fallback message', () => {
      const result = parseError(new Error('random'), 'saving your draft');
      expect(result.message).toContain('saving your draft');
    });

    it('works without context for matched errors', () => {
      const result = parseError(new TypeError('Failed to fetch'));
      expect(result.message).not.toContain('undefined');
    });
  });

  describe('AppError structure', () => {
    it('returns all required fields', () => {
      const result = parseError(new Error('test'));
      expect(result).toHaveProperty('original');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('recoverable');
    });

    it('preserves original error reference', () => {
      const originalError = new Error('preserve me');
      const result = parseError(originalError);
      expect(result.original).toBe(originalError);
    });
  });
});

describe('createErrorResponse', () => {
  it('wraps an error in a standard response format', () => {
    const response = createErrorResponse(new Error('test'), 'loading');
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
    expect(response.error.category).toBeDefined();
    expect(response.error.title).toBeDefined();
  });

  it('passes context through to parseError', () => {
    const response = createErrorResponse(new Error('random'), 'fetching guides');
    expect(response.error.message).toContain('fetching guides');
  });
});
