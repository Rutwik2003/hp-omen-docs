import Dexie, { Table } from 'dexie';

export interface DraftGuide {
    id: string; // The guide ID or "new"
    title: string;
    content: any; // Full form data state
    lastModified: number;
}

export class HpOmenDocsDB extends Dexie {
    drafts!: Table<DraftGuide>;

    constructor() {
        super('HpOmenDocsDB');
        this.version(1).stores({
            drafts: 'id, lastModified'
        });
    }
}

export const db = new HpOmenDocsDB();
