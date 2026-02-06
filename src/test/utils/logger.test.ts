import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createScopedLogger, devError, devLog, devWarn } from '../../utils/logger';

describe('logger utility', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('devLog', () => {
    it('should log in development mode', () => {
      // In test environment, DEV is typically true
      devLog('test message', { data: 123 });
      
      if (import.meta.env.DEV) {
        expect(console.log).toHaveBeenCalledWith('[DEV]', 'test message', { data: 123 });
      }
    });

    it('should accept multiple arguments', () => {
      devLog('arg1', 'arg2', 'arg3');
      
      if (import.meta.env.DEV) {
        expect(console.log).toHaveBeenCalledWith('[DEV]', 'arg1', 'arg2', 'arg3');
      }
    });
  });

  describe('devWarn', () => {
    it('should warn in development mode', () => {
      devWarn('warning message');
      
      if (import.meta.env.DEV) {
        expect(console.warn).toHaveBeenCalledWith('[DEV]', 'warning message');
      }
    });
  });

  describe('devError', () => {
    it('should log error in development mode', () => {
      const error = new Error('test error');
      devError('error occurred', error);
      
      if (import.meta.env.DEV) {
        expect(console.error).toHaveBeenCalledWith('[DEV]', 'error occurred', error);
      }
    });
  });

  describe('createScopedLogger', () => {
    it('should create a logger with scope prefix', () => {
      const log = createScopedLogger('TestComponent');
      
      log.info('test info');
      log.warn('test warning');
      log.error('test error');
      
      if (import.meta.env.DEV) {
        expect(console.log).toHaveBeenCalledWith('[DEV]', '[TestComponent]', 'test info');
        expect(console.warn).toHaveBeenCalledWith('[DEV]', '[TestComponent]', 'test warning');
        expect(console.error).toHaveBeenCalledWith('[DEV]', '[TestComponent]', 'test error');
      }
    });

    it('should return an object with info, warn, error methods', () => {
      const log = createScopedLogger('Module');
      
      expect(typeof log.info).toBe('function');
      expect(typeof log.warn).toBe('function');
      expect(typeof log.error).toBe('function');
    });
  });
});
