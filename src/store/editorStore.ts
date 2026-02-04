import { create } from 'zustand';
import { temporal } from 'zundo';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { DocPage, GuideStep } from '../types/docs';
import { Block, BlockType, GridBlock, ColumnBlock, TextBlock, HeadingBlock, CodeBlock, CalloutBlock, ImageBlock, VideoBlock, TableBlock } from '../types/blocks';

/**
 * Factory function to create a new block with proper default values.
 * Each block type has specific required properties initialized.
 * 
 * @param type - The type of block to create
 * @returns A new Block with a unique ID and type-specific defaults
 * 
 * @example
 * const textBlock = createBlock('text'); // { id: 'uuid', type: 'text', content: '' }
 * const gridBlock = createBlock('grid'); // { id: 'uuid', type: 'grid', columns: 2, children: [...] }
 */
const createBlock = (type: BlockType): Block => {
    const id = uuidv4();
    
    switch (type) {
        case 'text':
            return { id, type: 'text', content: '' } as TextBlock;
        case 'heading':
            return { id, type: 'heading', content: '', level: 2 } as HeadingBlock;
        case 'code':
            return { id, type: 'code', language: 'javascript', code: '' } as CodeBlock;
        case 'callout':
            return { id, type: 'callout', variant: 'info', content: '' } as CalloutBlock;
        case 'image':
            return { id, type: 'image', url: '' } as ImageBlock;
        case 'video':
            return { id, type: 'video', url: '', provider: 'youtube' } as VideoBlock;
        case 'table':
            return { id, type: 'table', content: { headers: [], rows: [] } } as TableBlock;
        case 'divider':
            return { id, type: 'divider' } as Block;
        case 'grid': {
            const columnId1 = uuidv4();
            const columnId2 = uuidv4();
            return {
                id,
                type: 'grid',
                columns: 2,
                children: [
                    { id: columnId1, type: 'column', children: [] } as ColumnBlock,
                    { id: columnId2, type: 'column', children: [] } as ColumnBlock
                ]
            } as GridBlock;
        }
        case 'column':
            return { id, type: 'column', children: [] } as ColumnBlock;
        default:
            return { id, type: 'text', content: '' } as TextBlock;
    }
};

interface EditorState {
    guide: Partial<DocPage>;
    activeStepId: string | null;

    /** Set the entire guide data */
    setGuide: (guide: Partial<DocPage>) => void;
    /** Set the currently active step for editing */
    setActiveStep: (id: string | null) => void;

    /** Add a new empty step to the guide */
    addStep: () => void;
    /** Remove a step by ID */
    removeStep: (id: string) => void;
    /** Update a step's title */
    updateStepTitle: (id: string, title: string) => void;
    /** Reorder steps (for drag-and-drop) */
    reorderSteps: (steps: GuideStep[]) => void;

    /** Add a new block to a step, optionally at a specific index or inside a parent container */
    addBlock: (stepId: string, type: BlockType, index?: number, parentId?: string) => void;
    /** Update a block's properties */
    updateBlock: (stepId: string, blockId: string, data: Partial<Block>) => void;
    /** Remove a block from a step */
    removeBlock: (stepId: string, blockId: string) => void;
    /** Move a block within the same step (for drag-and-drop) */
    moveBlock: (stepId: string, fromIndex: number, toIndex: number, parentId?: string) => void;
}

/**
 * Recursively searches for a block's children array by parent ID.
 * Used to find the container when adding/moving blocks inside Grid or Column blocks.
 * 
 * @param blocks - Array of blocks to search through
 * @param parentId - ID of the parent block whose children we want
 * @returns The children array of the found block, or undefined if not found
 */
const findContainer = (blocks: Block[], parentId: string): Block[] | undefined => {
    for (const block of blocks) {
        if (block.id === parentId) {
            // Found the parent block. Return its children if valid.
            if (block.type === 'grid') return (block as GridBlock).children;
            if (block.type === 'column') return (block as ColumnBlock).children;
        }
        // Recurse into grid/column children
        if (block.type === 'grid' || block.type === 'column') {
            const containerBlock = block as GridBlock | ColumnBlock;
            const found = findContainer(containerBlock.children, parentId);
            if (found) return found;
        }
    }
    return undefined;
};

/**
 * Recursively finds and removes a block from a nested block structure.
 * Handles blocks inside Grid and Column containers.
 * 
 * @param blocks - Array of blocks to search and modify
 * @param blockId - ID of the block to remove
 * @returns true if block was found and removed, false otherwise
 */
const removeBlockRecursive = (blocks: Block[], blockId: string): boolean => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index !== -1) {
        blocks.splice(index, 1);
        return true;
    }
    for (const block of blocks) {
        if (block.type === 'grid' || block.type === 'column') {
            const containerBlock = block as GridBlock | ColumnBlock;
            if (removeBlockRecursive(containerBlock.children, blockId)) return true;
        }
    }
    return false;
};

/**
 * Recursively finds and updates a block in a nested block structure.
 * Merges new data with existing block properties while preserving the type.
 * 
 * @param blocks - Array of blocks to search and modify
 * @param blockId - ID of the block to update
 * @param data - Partial block data to merge with existing properties
 * @returns true if block was found and updated, false otherwise
 */
const updateBlockRecursive = (blocks: Block[], blockId: string, data: Partial<Block>): boolean => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index !== -1) {
        // Merge existing block with new data, preserving the type
        const existingBlock = blocks[index];
        blocks[index] = { ...existingBlock, ...data } as Block;
        return true;
    }
    for (const block of blocks) {
        if (block.type === 'grid' || block.type === 'column') {
            const containerBlock = block as GridBlock | ColumnBlock;
            if (updateBlockRecursive(containerBlock.children, blockId, data)) return true;
        }
    }
    return false;
};

export const useEditorStore = create<EditorState>()(
    temporal(
        (set) => ({
            guide: { steps: [] },
            activeStepId: null,

            setGuide: (guide) => set({ guide }),
            setActiveStep: (id) => set({ activeStepId: id }),

            addStep: () => set((state) => produce(state, draft => {
                const newStep: GuideStep & { id: string } = {
                    id: uuidv4(),
                    title: 'New Step',
                    content: '',
                    blocks: []
                };
                if (!draft.guide.steps) draft.guide.steps = [];
                draft.guide.steps.push(newStep);
            })),

            removeStep: (id) => set((state) => produce(state, draft => {
                if (draft.guide.steps) {
                    draft.guide.steps = draft.guide.steps.filter((s) => s.id !== id);
                }
            })),

            updateStepTitle: (id, title) => set((state) => produce(state, draft => {
                const step = draft.guide.steps?.find((s) => s.id === id);
                if (step) step.title = title;
            })),

            reorderSteps: (steps) => set((state) => ({
                guide: { ...state.guide, steps }
            })),

            addBlock: (stepId, type, index, parentId) => set((state) => produce(state, draft => {
                const step = draft.guide.steps?.find(s => s.id === stepId);
                if (!step) return;

                const newBlock = createBlock(type);

                let targetList: Block[] = step.blocks || [];

                if (parentId) {
                    // If parentId provided, find the container (e.g. Inside a Column)
                    const container = findContainer(step.blocks || [], parentId);
                    if (container) targetList = container;
                }

                if (index !== undefined && index >= 0) {
                    targetList.splice(index, 0, newBlock);
                } else {
                    targetList.push(newBlock);
                }

                if (!step.blocks) step.blocks = targetList;
            })),

            updateBlock: (stepId, blockId, data) => set((state) => produce(state, draft => {
                const step = draft.guide.steps?.find(s => s.id === stepId);
                if (!step?.blocks) return;
                updateBlockRecursive(step.blocks, blockId, data);
            })),

            removeBlock: (stepId, blockId) => set((state) => produce(state, draft => {
                const step = draft.guide.steps?.find(s => s.id === stepId);
                if (!step?.blocks) return;
                removeBlockRecursive(step.blocks, blockId);
            })),

            moveBlock: (stepId, fromIndex, toIndex, parentId) => set((state) => produce(state, draft => {
                const step = draft.guide.steps?.find(s => s.id === stepId);
                if (!step?.blocks) return;

                let targetList: Block[] = step.blocks;

                if (parentId) {
                    const container = findContainer(step.blocks, parentId);
                    if (container) targetList = container;
                }

                const [movedBlock] = targetList.splice(fromIndex, 1);
                targetList.splice(toIndex, 0, movedBlock);
            }))
        }),
        { limit: 50 }
    )
);
