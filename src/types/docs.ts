/** Guide difficulty levels for filtering and display */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/** Callout/info box visual variants */
export type InfoBoxType = 'info' | 'warning' | 'success' | 'tip' | 'danger';
import { Block } from './blocks';

/**
 * A single step in a guide.
 * 
 * Unified type supporting both:
 * - Legacy format: `content` (HTML string) + optional `codeBlock`, `infoBox`, `prerequisites`, `grid`
 * - Modern format: `blocks[]` array with typed block system
 * 
 * The `migrateStepToBlocks()` utility in `blockMigration.ts` converts legacy → modern at load time.
 */
export interface GuideStep {
    /** UUID for editor tracking (required for new content, optional for legacy) */
    id?: string;
    title: string;
    
    // --- Modern block-based content ---
    /** New block-based content model. Takes priority over legacy fields when rendering. */
    blocks?: Block[];
    
    // --- Legacy markdown/HTML content (deprecated, migrated at load time) ---
    /** @deprecated Legacy markdown/HTML content. Use blocks[] instead. */
    content?: string;
    /** @deprecated Legacy image URL */
    image?: string;
    /** @deprecated Legacy code block */
    codeBlock?: {
        language: string;
        code: string;
        copyable?: boolean;
    };
    /** @deprecated Legacy info box */
    infoBox?: {
        type: InfoBoxType;
        title: string;
        content: string;
    };
    /** @deprecated Legacy prerequisites list */
    prerequisites?: string[];
    /** @deprecated Legacy grid layout */
    grid?: {
        columns: number;
        items: Array<{
            title?: string;
            content: string;
        }>;
    };
}

/**
 * Complete guide document structure.
 * Represents a full guide page with metadata, prerequisites, and steps.
 */
export interface DocPage {
    /** Unique URL slug (e.g., 'unboxing-setup') */
    id: string;
    title: string;
    description: string;
    /** Guide category (e.g., 'Performance', 'Troubleshooting') */
    category: string;
    metadata: {
        difficulty: Difficulty;
        /** Estimated read time (e.g., '15 min') */
        readTime: string;
        /** ISO date string */
        lastUpdated: string;
        tags?: string[];
    };
    breadcrumbs: {
        label: string;
        path?: string;
    }[];
    prerequisites?: {
        title?: string;
        items: string[];
        type?: InfoBoxType;
    };
    steps: GuideStep[];
}

/**
 * Partial guide data for editor drafts.
 * Contains only the fields editable in the guide editor.
 * Used by useGuideDraft hook for auto-save persistence.
 */
export interface GuideDraftData {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: Difficulty;
    /** Estimated read time */
    readTime?: string;
    tags?: string[];
    steps?: GuideStep[];
}
