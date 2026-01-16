export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type InfoBoxType = 'info' | 'warning' | 'success' | 'tip' | 'danger';
import { Block } from './blocks';

export interface GuideStep {
    id?: string; // UUID for Editor
    title: string;
    content: string; // Markdown supported
    image?: string;
    codeBlock?: {
        language: string;
        code: string;
        copyable?: boolean;
    };
    infoBox?: {
        type: InfoBoxType;
        title: string;
        content: string;
    };
    prerequisites?: string[];
    grid?: {
        columns: number;
        items: Array<{
            title?: string;
            content: string;
        }>;
    };
    blocks?: Block[]; // New Block-Based Model
}

export interface DocPage {
    id: string; // unique slug e.g. 'unboxing-setup'
    title: string;
    description: string;
    category: string;
    metadata: {
        difficulty: Difficulty;
        readTime: string;
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
