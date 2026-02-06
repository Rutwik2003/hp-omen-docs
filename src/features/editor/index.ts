/**
 * Editor Feature Module
 * 
 * This module contains all editor-related functionality including:
 * - Components (toolbar, blocks, canvas)
 * - Hooks (useGuideDraft, useDraftList)
 * - Store (editorStore with Zustand)
 * - Types (block definitions, editor state)
 * 
 * Usage:
 * ```tsx
 * import { useEditorStore, useGuideDraft, EditorToolbar } from '@/features/editor';
 * ```
 */

// Components - re-export from original locations
export { default as EditorToolbar } from '../../pages/admin/editor/EditorToolbar';
export { default as GuideForm } from '../../pages/admin/editor/GuideForm';
export { default as StepEditor } from '../../pages/admin/editor/StepEditor';
export { default as SlashCommandMenu } from '../../pages/admin/editor/SlashCommandMenu';

// Block components - re-export from original locations
export { default as BlockList } from '../../pages/admin/editor/blocks/BlockList';
export { default as BlockRenderer } from '../../pages/admin/editor/blocks/BlockRenderer';
export { default as RichTextBlock } from '../../pages/admin/editor/blocks/RichTextBlock';
export { default as CodeBlockEditor } from '../../pages/admin/editor/blocks/CodeBlockEditor';
export { default as CalloutBlockEditor } from '../../pages/admin/editor/blocks/CalloutBlockEditor';
export { default as ImageBlockEditor } from '../../pages/admin/editor/blocks/ImageBlockEditor';
export { default as GridBlockEditor } from '../../pages/admin/editor/blocks/GridBlockEditor';
export { default as TableBlockEditor } from '../../pages/admin/editor/blocks/TableBlockEditor';

// Hooks
export { useGuideDraft } from '../../hooks/useGuideDraft';
export { useDraftList } from '../../hooks/useDraftList';

// Store
export { useEditorStore } from '../../store/editorStore';

// Types - re-export from shared types
export type {
    Block,
    BlockType,
    BaseBlock,
    TextBlock,
    HeadingBlock,
    ImageBlock,
    VideoBlock,
    CodeBlock,
    CalloutBlock,
    GridBlock,
    ColumnBlock,
    TableBlock,
} from '../../types/blocks';

export type {
    GuideDraftData,
} from '../../types/docs';

export type {
    EditorState,
    DraftRecord,
    DraftListItem,
} from './types/editor';

// Constants
export { DRAFT_IDS } from '../../constants';
