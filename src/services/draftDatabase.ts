import Dexie, { Table } from 'dexie';
import { GuideDraftData } from '../types/docs';

/**
 * Represents a saved draft guide in IndexedDB.
 * Contains both metadata (for listing) and full content (for restoration).
 */
/** Where the draft originated — admin panel or community /contribute page */
export type DraftSource = 'admin' | 'community';

export interface DraftGuide {
    /** Unique identifier - either the guide ID being edited or a well-known draft constant */
    id: string;
    /** Guide title for display in draft list */
    title: string;
    /** Full form data state (GuideDraftData) for restoration */
    content: GuideDraftData;
    /** Unix timestamp of last modification */
    lastModified: number;
    /** Unix timestamp of initial creation */
    createdAt?: number;
    /** Number of steps in the guide */
    stepCount?: number;
    /** Approximate word count across all content */
    wordCount?: number;
    /** Category for filtering (e.g., 'Performance', 'Troubleshooting') */
    category?: string;
    /** Origin of the draft — keeps admin and community drafts separated */
    source?: DraftSource;
}

/**
 * IndexedDB database for storing guide drafts locally.
 * Uses Dexie.js for simplified IndexedDB access.
 * 
 * Schema (v2):
 * - drafts: Primary key 'id', indexed by 'lastModified' and 'createdAt'
 * 
 * @example
 * import { db } from './draftDatabase';
 * await db.drafts.put({ id: 'guide-1', title: 'My Guide', ... });
 * const draft = await db.drafts.get('guide-1');
 */
export class HpOmenDocsDB extends Dexie {
    drafts!: Table<DraftGuide>;

    constructor() {
        super('HpOmenDocsDB');
        this.version(2).stores({
            drafts: 'id, lastModified, createdAt'
        });
        // v3: Add source index for filtering admin vs community drafts
        this.version(3).stores({
            drafts: 'id, lastModified, createdAt, source'
        });
    }

    /**
     * Retrieves all drafts sorted by last modified date (newest first).
     * Optionally filtered by source (admin or community).
     * 
     * @param source - If provided, only returns drafts from this source
     * @returns Array of drafts, sorted by lastModified descending
     */
    async getAllDrafts(source?: DraftSource): Promise<DraftGuide[]> {
        if (source) {
            return await this.drafts
                .where('source')
                .equals(source)
                .reverse()
                .sortBy('lastModified');
        }
        return await this.drafts.orderBy('lastModified').reverse().toArray();
    }

    /**
     * Returns the total number of saved drafts.
     * Useful for showing draft count badges.
     * 
     * @returns Number of drafts in the database
     */
    async getDraftCount(): Promise<number> {
        return await this.drafts.count();
    }

    /**
     * Removes old drafts, keeping only the most recent N drafts.
     * Call periodically to prevent database bloat.
     * 
     * @param keepCount - Number of recent drafts to keep (default: 10)
     */
    async cleanupOldDrafts(keepCount: number = 10): Promise<void> {
        const drafts = await this.getAllDrafts();
        if (drafts.length > keepCount) {
            const toDelete = drafts.slice(keepCount);
            await Promise.all(toDelete.map(d => this.drafts.delete(d.id)));
        }
    }
}

export const db = new HpOmenDocsDB();
