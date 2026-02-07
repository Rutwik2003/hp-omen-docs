import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGuideDraft } from '../../hooks/useGuideDraft';
import { ToastProvider } from '../../context/ToastContext';
import React from 'react';

// Mock the database module
vi.mock('../../services/draftDatabase', () => ({
  db: {
    drafts: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Wrapper with ToastProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useGuideDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset online status
    Object.defineProperty(navigator, 'onLine', { value: true });
  });

  it('should initialize with default state for new guide', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    expect(result.current.hasDraft).toBe(false);
    expect(result.current.lastSaved).toBe(null);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.isOnline).toBe(true);
  });

  it('should provide saveDraft function', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', { title: 'Test Guide' }, true),
      { wrapper }
    );

    expect(result.current.saveDraft).toBeDefined();
    expect(typeof result.current.saveDraft).toBe('function');
  });

  it('should provide restoreDraft function', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    expect(result.current.restoreDraft).toBeDefined();
    expect(typeof result.current.restoreDraft).toBe('function');
  });

  it('should provide clearDraft function', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    expect(result.current.clearDraft).toBeDefined();
    expect(typeof result.current.clearDraft).toBe('function');
  });

  it('should provide forceSave function', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    expect(result.current.forceSave).toBeDefined();
    expect(typeof result.current.forceSave).toBe('function');
  });

  it('should return null when restoreDraft is called without draft data', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    const restored = result.current.restoreDraft();
    expect(restored).toBe(null);
  });

  it('should not save draft without title', async () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', { description: 'No title' }, true),
      { wrapper }
    );

    await act(async () => {
      const success = await result.current.saveDraft();
      expect(success).toBe(false);
    });
  });

  it('should save draft with valid data', async () => {
    const { db } = await import('../../services/draftDatabase');
    
    const { result } = renderHook(
      () => useGuideDraft('test-id', { title: 'Valid Guide', steps: [] }, true),
      { wrapper }
    );

    await act(async () => {
      const success = await result.current.saveDraft();
      expect(success).toBe(true);
    });

    expect(db.drafts.put).toHaveBeenCalled();
    expect(result.current.hasDraft).toBe(true);
    expect(result.current.lastSaved).not.toBe(null);
  });

  it('should detect online status', () => {
    const { result } = renderHook(
      () => useGuideDraft('test-id', null, true),
      { wrapper }
    );

    expect(result.current.isOnline).toBe(true);
  });

  it('should check for existing draft on mount', async () => {
    const { db } = await import('../../services/draftDatabase');
    vi.mocked(db.drafts.get).mockResolvedValueOnce({
      id: 'test-id',
      title: 'Existing Draft',
      content: { title: 'Existing' },
      lastModified: Date.now(),
    });

    const { result } = renderHook(
      () => useGuideDraft('test-id', null, false),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.hasDraft).toBe(true);
    });
  });

  it('should clear draft successfully', async () => {
    const { db } = await import('../../services/draftDatabase');
    
    // storageId is now the passed guideId directly (no internal override)
    const { result } = renderHook(
      () => useGuideDraft('test-id', { title: 'Test' }, true),
      { wrapper }
    );

    await act(async () => {
      await result.current.clearDraft();
    });

    expect(db.drafts.delete).toHaveBeenCalledWith('test-id');
    expect(result.current.hasDraft).toBe(false);
  });
});
