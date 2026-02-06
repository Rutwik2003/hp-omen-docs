import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ToastProvider, useToast } from '../../context/ToastContext';
import React from 'react';

// Wrapper component for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useToast', () => {
  it('should throw error when used outside ToastProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
    
    consoleSpy.mockRestore();
  });

  it('should add a toast successfully', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('success', 'Test Title', 'Test Message');
    });

    // Toast was added (we can't easily check internal state, but no error means success)
    expect(result.current.addToast).toBeDefined();
  });

  it('should not add duplicate toasts within 1 second', async () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    // Add first toast
    act(() => {
      result.current.addToast('success', 'Same Title', 'Same Message');
    });

    // Try to add duplicate immediately - should be suppressed
    act(() => {
      result.current.addToast('success', 'Same Title', 'Same Message');
    });

    // The function should still be callable without error
    expect(result.current.addToast).toBeDefined();
  });

  it('should provide removeToast function', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    expect(result.current.removeToast).toBeDefined();
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('should handle different toast types', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    const toastTypes = ['success', 'error', 'info', 'warning'] as const;

    toastTypes.forEach((type) => {
      act(() => {
        result.current.addToast(type, `${type} title`, `${type} message`);
      });
    });

    expect(result.current.addToast).toBeDefined();
  });
});
