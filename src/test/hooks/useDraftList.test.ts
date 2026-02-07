import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDraftList } from '../../hooks/useDraftList';

// Mock the database module
vi.mock('../../services/draftDatabase', () => {
  const mockDrafts = [
    {
      id: 'draft-1',
      title: 'Test Draft 1',
      content: { title: 'Test' },
      lastModified: Date.now(),
      createdAt: Date.now(),
      stepCount: 2,
      wordCount: 100,
      category: 'quickstart',
      source: 'community',
    },
    {
      id: 'draft-2',
      title: 'Test Draft 2',
      content: { title: 'Test 2' },
      lastModified: Date.now() - 1000,
      createdAt: Date.now() - 1000,
      stepCount: 3,
      wordCount: 200,
      category: 'windows',
      source: 'community',
    },
    {
      id: 'admin-draft-1',
      title: 'Admin Draft',
      content: { title: 'Admin' },
      lastModified: Date.now() - 500,
      createdAt: Date.now() - 500,
      stepCount: 1,
      wordCount: 50,
      category: 'performance',
      source: 'admin',
    },
  ];

  return {
    db: {
      getAllDrafts: vi.fn().mockImplementation((source?: string) => {
        if (source) {
          return Promise.resolve(mockDrafts.filter(d => d.source === source));
        }
        return Promise.resolve(mockDrafts);
      }),
      drafts: {
        delete: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockImplementation((id: string) => 
          Promise.resolve(mockDrafts.find(d => d.id === id))
        ),
      },
    },
    DraftGuide: {},
  };
});

describe('useDraftList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useDraftList());
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.drafts).toEqual([]);
  });

  it('should load drafts on mount', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.drafts).toHaveLength(3);
    expect(result.current.hasDrafts).toBe(true);
  });

  it('should return correct draft by id', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const draft = await result.current.getDraft('draft-1');
    expect(draft?.title).toBe('Test Draft 1');
  });

  it('should return undefined for non-existent draft', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const draft = await result.current.getDraft('non-existent');
    expect(draft).toBeUndefined();
  });

  it('should delete a draft', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialLength = result.current.drafts.length;

    await act(async () => {
      const success = await result.current.deleteDraft('draft-1');
      expect(success).toEqual({ success: true });
    });

    expect(result.current.drafts.length).toBe(initialLength - 1);
    expect(result.current.drafts.find(d => d.id === 'draft-1')).toBeUndefined();
  });

  it('should clear all drafts', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const success = await result.current.clearAllDrafts();
      expect(success).toEqual({ success: true });
    });

    expect(result.current.drafts).toHaveLength(0);
    expect(result.current.hasDrafts).toBe(false);
  });

  it('should reload drafts when loadDrafts is called', async () => {
    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.loadDrafts();
    });

    expect(result.current.drafts).toHaveLength(3);
  });

  it('should filter drafts by source when provided', async () => {
    const { result } = renderHook(() => useDraftList('community'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.drafts).toHaveLength(2);
    expect(result.current.drafts.every(d => d.source === 'community')).toBe(true);
  });

  it('should filter admin drafts when source is admin', async () => {
    const { result } = renderHook(() => useDraftList('admin'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.drafts).toHaveLength(1);
    expect(result.current.drafts[0].title).toBe('Admin Draft');
  });

  it('should have hasDrafts as false when no drafts', async () => {
    // Override mock to return empty array
    const { db } = await import('../../services/draftDatabase');
    vi.mocked(db.getAllDrafts).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useDraftList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasDrafts).toBe(false);
  });
});
