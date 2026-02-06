import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSession,
  createSession,
  extendSession,
  getSessionHash,
  validateSession,
} from '../../utils/sessionManager';

describe('sessionManager', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });

  describe('createSession', () => {
    it('should create a new session and return a hash', async () => {
      const hash = await createSession();
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should store session data in sessionStorage', async () => {
      await createSession();
      
      const stored = sessionStorage.getItem('admin_session');
      expect(stored).not.toBeNull();
      
      const session = JSON.parse(stored!);
      expect(session).toHaveProperty('sessionHash');
      expect(session).toHaveProperty('createdAt');
      expect(session).toHaveProperty('expiresAt');
    });

    it('should set expiration 2 hours in the future', async () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      await createSession();
      
      const stored = sessionStorage.getItem('admin_session');
      const session = JSON.parse(stored!);
      
      const twoHoursMs = 2 * 60 * 60 * 1000;
      expect(session.expiresAt).toBe(now + twoHoursMs);
    });
  });

  describe('validateSession', () => {
    it('should return false when no session exists', () => {
      const result = validateSession();
      expect(result).toBe(false);
    });

    it('should return true for valid unexpired session', async () => {
      await createSession();
      
      const result = validateSession();
      expect(result).toBe(true);
    });

    it('should return false for expired session', async () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      await createSession();
      
      // Advance time past expiration (2 hours + 1 second)
      vi.setSystemTime(now + 2 * 60 * 60 * 1000 + 1000);
      
      const result = validateSession();
      expect(result).toBe(false);
    });

    it('should clear expired session', async () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      await createSession();
      
      // Advance time past expiration
      vi.setSystemTime(now + 2 * 60 * 60 * 1000 + 1000);
      
      validateSession();
      
      expect(sessionStorage.getItem('admin_session')).toBeNull();
    });

    it('should return false for malformed session data', () => {
      sessionStorage.setItem('admin_session', 'invalid-json');
      
      const result = validateSession();
      expect(result).toBe(false);
    });
  });

  describe('getSessionHash', () => {
    it('should return null when no session exists', () => {
      const hash = getSessionHash();
      expect(hash).toBeNull();
    });

    it('should return the session hash for valid session', async () => {
      const createdHash = await createSession();
      
      const retrievedHash = getSessionHash();
      expect(retrievedHash).toBe(createdHash);
    });

    it('should return null for expired session', async () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      await createSession();
      
      // Advance time past expiration
      vi.setSystemTime(now + 2 * 60 * 60 * 1000 + 1000);
      
      const hash = getSessionHash();
      expect(hash).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should remove session from sessionStorage', async () => {
      await createSession();
      expect(sessionStorage.getItem('admin_session')).not.toBeNull();
      
      clearSession();
      expect(sessionStorage.getItem('admin_session')).toBeNull();
    });

    it('should not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });
  });

  describe('extendSession', () => {
    it('should extend session expiration', async () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      await createSession();
      
      // Advance time by 1 hour
      vi.setSystemTime(now + 60 * 60 * 1000);
      
      extendSession();
      
      const stored = sessionStorage.getItem('admin_session');
      const session = JSON.parse(stored!);
      
      // New expiration should be 2 hours from current time
      const expectedExpiry = now + 60 * 60 * 1000 + 2 * 60 * 60 * 1000;
      expect(session.expiresAt).toBe(expectedExpiry);
    });

    it('should not throw when no session exists', () => {
      expect(() => extendSession()).not.toThrow();
    });
  });
});
