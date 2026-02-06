/** Guide difficulty levels for filtering and display */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/** Callout/info box visual variants */
export type InfoBoxType = 'info' | 'warning' | 'success' | 'tip' | 'danger';
import { Block } from './blocks';

/**
 * A single step in a guide.
 * Supports both legacy markdown format and new block-based content.
 */
export interface GuideStep {
    /** UUID for editor tracking */
    id?: string;
    title: string;
    /** Legacy markdown content */
    content: string;
    image?: string;
    /** Legacy code block */
    codeBlock?: {
        language: string;
        code: string;
        copyable?: boolean;
    };
    /** Legacy info box */
    infoBox?: {
        type: InfoBoxType;
        title: string;
        content: string;
    };
    prerequisites?: string[];
    /** Legacy grid layout */
    grid?: {
        columns: number;
        items: Array<{
            title?: string;
            content: string;
        }>;
    };
    /** New block-based content model */
    blocks?: Block[];
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
