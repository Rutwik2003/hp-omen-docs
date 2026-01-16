import { create } from 'zustand';
import { temporal } from 'zundo';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { DocPage, GuideStep } from '../types/docs';
import { Block, BlockType, GridBlock, ColumnBlock } from '../types/blocks';

interface EditorState {
    guide: Partial<DocPage>;
    activeStepId: string | null;

    // Global Actions
    setGuide: (guide: Partial<DocPage>) => void;
    setActiveStep: (id: string | null) => void;

    // Step Actions
    addStep: () => void;
    removeStep: (id: string) => void;
    updateStepTitle: (id: string, title: string) => void;
    reorderSteps: (steps: GuideStep[]) => void;

    // Block Actions
    addBlock: (stepId: string, type: BlockType, index?: number, parentId?: string) => void;
    updateBlock: (stepId: string, blockId: string, data: Partial<Block>) => void;
    removeBlock: (stepId: string, blockId: string) => void;
    moveBlock: (stepId: string, fromIndex: number, toIndex: number, parentId?: string) => void;
}

// Recursive helper to find a block's container (children array)
const findContainer = (blocks: Block[], parentId: string): Block[] | undefined => {
    for (const block of blocks) {
        if (block.id === parentId) {
            // Found the parent block. Return its children if valid.
            if (block.type === 'grid') return (block as GridBlock).children;
            if (block.type === 'column') return (block as ColumnBlock).children;
        }
        // Recurse
        if ('children' in block) {
            const found = findContainer((block as any).children, parentId);
            if (found) return found;
        }
    }
    return undefined;
};

// Recursive helper to find and remove a block
const removeBlockRecursive = (blocks: Block[], blockId: string): boolean => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index !== -1) {
        blocks.splice(index, 1);
        return true;
    }
    for (const block of blocks) {
        if ('children' in block) {
            if (removeBlockRecursive((block as any).children, blockId)) return true;
        }
    }
    return false;
};

// Recursive helper to find and update a block
const updateBlockRecursive = (blocks: Block[], blockId: string, data: Partial<Block>): boolean => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index !== -1) {
        // Cast to any to avoid complex union type spread errors
        blocks[index] = { ...blocks[index], ...data } as any;
        return true;
    }
    for (const block of blocks) {
        if ('children' in block) {
            if (updateBlockRecursive((block as any).children, blockId, data)) return true;
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

                const newBlock: any = {
                    id: uuidv4(),
                    type,
                    content: '',
                };

                if (type === 'grid') {
                    newBlock.columns = 2;
                    newBlock.children = [
                        { id: uuidv4(), type: 'column', children: [] },
                        { id: uuidv4(), type: 'column', children: [] }
                    ];
                }

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
