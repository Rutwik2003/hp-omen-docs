import { v4 as uuidv4 } from 'uuid';
import { GuideStep } from '../types/docs';
import { Block } from '../types/blocks';

export const migrateStepToBlocks = (step: GuideStep): Block[] => {
    // If blocks already exist, return them (idempotent)
    if (step.blocks && step.blocks.length > 0) {
        return step.blocks;
    }

    const blocks: Block[] = [];

    // 1. Core Content -> Text Block
    if (step.content && step.content.trim()) {
        blocks.push({
            id: uuidv4(),
            type: 'text',
            content: step.content
        });
    }

    // 2. Code Block
    if (step.codeBlock) {
        blocks.push({
            id: uuidv4(),
            type: 'code',
            language: step.codeBlock.language,
            code: step.codeBlock.code
        });
    }

    // 3. InfoBox -> Callout Block
    if (step.infoBox) {
        blocks.push({
            id: uuidv4(),
            type: 'callout',
            variant: step.infoBox.type,
            title: step.infoBox.title,
            content: step.infoBox.content
        });
    }

    // 4. Legacy Grid -> Grid Block
    if (step.grid) {
        // Current grid implementation was simplified to flat items.
        // New GridBlock structure expects children.
        // We will simulate this by creating a GridBlock with empty slots for now,
        // or convert the flat items into TextBlocks inside the grid?
        // Since the new grid architecture might be complex, we'll try to map it simply.

        // For now, let's treat the legacy grid items as TextBlocks that happen to be in a grid.
        // NOTE: This is a simplification. Real migration might need Recursive definition.
        // But since 'grid' property on GuideStep was: { columns: number, items: {title, content}[] }
        // We can't 1:1 map to nested blocks easily without the new structure supporting layout slots.

        // Fallback: Create multiple Callout/Text Blocks to represent the grid data so it's not lost.
        step.grid.items.forEach(item => {
            blocks.push({
                id: uuidv4(),
                type: 'text',
                content: `<h3>${item.title || 'Column'}</h3>${item.content}`
            });
        });
    }

    return blocks;
};
