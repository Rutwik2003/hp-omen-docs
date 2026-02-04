/**
 * Editor-specific type definitions
 * Re-exports block types and adds editor state types
 */

// Re-export all block types from the shared types
export * from '../../../types/blocks';

// Re-export guide draft data type
export type { GuideDraftData } from '../../../types/docs';

import type { DocPage } from '../../../types/docs';
import type { Block, BlockType } from '../../../types/blocks';

/**
 * Editor store state interface
 */
export interface EditorState {
    /** Current guide being edited */
    guide: Partial<DocPage>;
    /** Currently active step ID for editing */
    activeStepId: string | null;

    // Global Actions
    setGuide: (guide: Partial<DocPage>) => void;
    setActiveStep: (id: string | null) => void;

    // Step Actions
    addStep: () => void;
    removeStep: (id: string) => void;
    updateStepTitle: (id: string, title: string) => void;
    reorderSteps: (sourceIndex: number, destinationIndex: number) => void;

    // Block Actions
    addBlock: (stepId: string, type: BlockType) => void;
    addBlockAtIndex: (stepId: string, type: BlockType, index: number) => void;
    removeBlock: (stepId: string, blockId: string) => void;
    updateBlock: <T extends Block>(stepId: string, blockId: string, updates: Partial<T>) => void;
    moveBlock: (stepId: string, sourceIndex: number, destinationIndex: number) => void;

    // Grid-specific Actions
    addBlockToColumn: (stepId: string, gridId: string, columnIndex: number, type: BlockType) => void;
    removeBlockFromColumn: (stepId: string, gridId: string, columnIndex: number, blockId: string) => void;
    updateBlockInColumn: <T extends Block>(
        stepId: string,
        gridId: string,
        columnIndex: number,
        blockId: string,
        updates: Partial<T>
    ) => void;
}

/**
 * Draft storage record
 */
export interface DraftRecord {
    id: string;
    title: string;
    content: Partial<DocPage>;
    lastModified: number;
    createdAt: number;
    stepCount: number;
    wordCount: number;
    category: string;
}

/**
 * Draft list item for display
 */
export interface DraftListItem {
    id: string;
    title: string;
    lastModified: Date;
    createdAt: Date;
    stepCount: number;
    wordCount: number;
    category: string;
}
