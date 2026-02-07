/**
 * Features Module Index
 *
 * Central export point for feature modules.
 * Each feature is a self-contained module with its own components, types, etc.
 *
 * Note: Editor functionality lives in src/store/editorStore.ts,
 * src/pages/admin/editor/, and src/hooks/ — not in features/.
 */

// Layouts feature - composable layout components
export * from './layouts';

// Validation feature - content validation schemas
export * from './validation';
