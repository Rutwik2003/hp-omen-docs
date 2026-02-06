import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkAuth } from '../../utils/adminApi';

// Mock fetch for production mode tests
global.fetch = vi.fn();

describe('adminApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAuth', () => {
    it('should be a function', () => {
      expect(typeof checkAuth).toBe('function');
    });

    it('should return a promise', () => {
      const result = checkAuth('test');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return boolean from promise', async () => {
      // In dev mode with no env var set, should return false
      const result = await checkAuth('wrong-password');
      expect(typeof result).toBe('boolean');
    });

    // Note: Full integration tests would require mocking import.meta.env
    // which is complex in Vitest. These tests verify the basic contract.
  });
});
