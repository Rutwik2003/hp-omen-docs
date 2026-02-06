/**
 * Features Module Index
 * 
 * Central export point for all feature modules.
 * Each feature is a self-contained module with its own:
 * - Components
 * - Hooks
 * - Types
 * - Store (if needed)
 * 
 * Usage:
 * ```tsx
 * // Import from specific feature
 * import { useEditorStore } from '@/features/editor';
 * import { BaseLayout } from '@/features/layouts';
 * import { validateGuide } from '@/features/validation';
 * ```
 */

// Editor feature - guide editing functionality
export * from './editor';

// Layouts feature - composable layout components
export * from './layouts';

// Validation feature - content validation schemas
export * from './validation';
