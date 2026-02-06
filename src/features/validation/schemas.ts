/**
 * Content Validation Schemas
 * 
 * Uses a lightweight validation approach without external dependencies.
 * Can be upgraded to Zod if more complex validation is needed.
 */

import type { DocPage } from '../../types/docs';
import type { BlockType } from '../../types/blocks';
import type { ValidationError, ValidationResult } from './types';

// Valid block types
const VALID_BLOCK_TYPES: BlockType[] = [
    'text', 'heading', 'image', 'video', 'code', 
    'callout', 'grid', 'column', 'table', 'divider'
];

// Valid difficulty levels
const VALID_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

// Valid callout variants
const VALID_CALLOUT_VARIANTS = ['info', 'warning', 'tip', 'danger'] as const;

/**
 * Validate a single block
 */
export function validateBlock(block: unknown, path: string = 'block'): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!block || typeof block !== 'object') {
        errors.push({ path, message: 'Block must be an object' });
        return errors;
    }

    const b = block as Record<string, unknown>;

    // Required fields
    if (!b.id || typeof b.id !== 'string') {
        errors.push({ path: `${path}.id`, message: 'Block must have a string id' });
    }

    if (!b.type || typeof b.type !== 'string') {
        errors.push({ path: `${path}.type`, message: 'Block must have a type' });
    } else if (!VALID_BLOCK_TYPES.includes(b.type as BlockType)) {
        errors.push({ 
            path: `${path}.type`, 
            message: `Invalid block type: ${b.type}. Valid types: ${VALID_BLOCK_TYPES.join(', ')}` 
        });
    }

    // Type-specific validation
    if (b.type === 'text' || b.type === 'heading') {
        if (typeof b.content !== 'string') {
            errors.push({ path: `${path}.content`, message: `${b.type} block must have string content` });
        }
    }

    if (b.type === 'heading') {
        if (b.level && ![1, 2, 3].includes(b.level as number)) {
            errors.push({ path: `${path}.level`, message: 'Heading level must be 1, 2, or 3' });
        }
    }

    if (b.type === 'code') {
        if (typeof b.code !== 'string') {
            errors.push({ path: `${path}.code`, message: 'Code block must have string code' });
        }
        if (typeof b.language !== 'string') {
            errors.push({ path: `${path}.language`, message: 'Code block must have string language' });
        }
    }

    if (b.type === 'callout') {
        if (typeof b.content !== 'string') {
            errors.push({ path: `${path}.content`, message: 'Callout must have string content' });
        }
        if (b.variant && !VALID_CALLOUT_VARIANTS.includes(b.variant as typeof VALID_CALLOUT_VARIANTS[number])) {
            errors.push({ 
                path: `${path}.variant`, 
                message: `Invalid callout variant. Valid: ${VALID_CALLOUT_VARIANTS.join(', ')}` 
            });
        }
    }

    if (b.type === 'image') {
        if (typeof b.url !== 'string') {
            errors.push({ path: `${path}.url`, message: 'Image block must have string url' });
        }
    }

    if (b.type === 'grid') {
        if (!Array.isArray(b.children)) {
            errors.push({ path: `${path}.children`, message: 'Grid must have children array' });
        } else {
            (b.children as unknown[]).forEach((child, i) => {
                errors.push(...validateBlock(child, `${path}.children[${i}]`));
            });
        }
    }

    if (b.type === 'column') {
        if (!Array.isArray(b.children)) {
            errors.push({ path: `${path}.children`, message: 'Column must have children array' });
        } else {
            (b.children as unknown[]).forEach((child, i) => {
                errors.push(...validateBlock(child, `${path}.children[${i}]`));
            });
        }
    }

    return errors;
}

/**
 * Validate a guide step
 */
export function validateStep(step: unknown, path: string = 'step'): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!step || typeof step !== 'object') {
        errors.push({ path, message: 'Step must be an object' });
        return errors;
    }

    const s = step as Record<string, unknown>;

    // Required title
    if (!s.title || typeof s.title !== 'string') {
        errors.push({ path: `${path}.title`, message: 'Step must have a string title' });
    }

    // Validate blocks if present
    if (s.blocks) {
        if (!Array.isArray(s.blocks)) {
            errors.push({ path: `${path}.blocks`, message: 'Blocks must be an array' });
        } else {
            (s.blocks as unknown[]).forEach((block, i) => {
                errors.push(...validateBlock(block, `${path}.blocks[${i}]`));
            });
        }
    }

    return errors;
}

/**
 * Validate a complete guide document
 */
export function validateGuide(guide: unknown): ValidationResult<DocPage> {
    const errors: ValidationError[] = [];

    if (!guide || typeof guide !== 'object') {
        return {
            success: false,
            errors: [{ path: 'guide', message: 'Guide must be an object' }]
        };
    }

    const g = guide as Record<string, unknown>;

    // Required fields
    if (!g.title || typeof g.title !== 'string') {
        errors.push({ path: 'title', message: 'Guide must have a string title' });
    }

    if (!g.description || typeof g.description !== 'string') {
        errors.push({ path: 'description', message: 'Guide must have a string description' });
    }

    if (!g.category || typeof g.category !== 'string') {
        errors.push({ path: 'category', message: 'Guide must have a string category' });
    }

    // Metadata validation
    if (g.metadata && typeof g.metadata === 'object') {
        const meta = g.metadata as Record<string, unknown>;
        
        if (meta.difficulty && !VALID_DIFFICULTIES.includes(meta.difficulty as typeof VALID_DIFFICULTIES[number])) {
            errors.push({ 
                path: 'metadata.difficulty', 
                message: `Invalid difficulty. Valid: ${VALID_DIFFICULTIES.join(', ')}` 
            });
        }
    }

    // Steps validation
    if (!g.steps || !Array.isArray(g.steps)) {
        errors.push({ path: 'steps', message: 'Guide must have a steps array' });
    } else if (g.steps.length === 0) {
        errors.push({ path: 'steps', message: 'Guide must have at least one step' });
    } else {
        (g.steps as unknown[]).forEach((step, i) => {
            errors.push(...validateStep(step, `steps[${i}]`));
        });
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: guide as DocPage };
}

// Schema objects for export (for documentation/reference)
export const blockSchema = {
    type: 'object',
    required: ['id', 'type'],
    properties: {
        id: { type: 'string' },
        type: { type: 'string', enum: VALID_BLOCK_TYPES },
    }
};

export const stepSchema = {
    type: 'object',
    required: ['title'],
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        blocks: { type: 'array', items: blockSchema },
    }
};

export const guideSchema = {
    type: 'object',
    required: ['title', 'description', 'category', 'steps'],
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        metadata: {
            type: 'object',
            properties: {
                difficulty: { type: 'string', enum: VALID_DIFFICULTIES },
                readTime: { type: 'string' },
                lastUpdated: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
            }
        },
        steps: { type: 'array', items: stepSchema, minItems: 1 },
    }
};
