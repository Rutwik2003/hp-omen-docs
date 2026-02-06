import { DocPage } from '../types/docs';
import { Block } from '../types/blocks';

// Eagerly load all content JSONs
const contentModules = import.meta.glob('../content/**/*.json', { eager: true });

export interface DocSummary {
    id: string;
    title: string;
    description: string;
    category: string;
    path: string;
    metadata: {
        difficulty: string;
        readTime: string;
        lastUpdated: string;
    };
}

/** Extended DocSummary with full document data for admin/editor use */
export interface DocWithContent extends DocSummary {
    steps: DocPage['steps'];
    breadcrumbs?: DocPage['breadcrumbs'];
    prerequisites?: DocPage['prerequisites'];
}

// Helper to extract text from various block types
const extractTextFromBlocks = (blocks: Block[]): string => {
    if (!blocks) return '';
    return blocks.map(block => {
        if (block.type === 'text' || block.type === 'heading' || block.type === 'callout') {
            return block.content;
        }
        if (block.type === 'list') {
            return block.content.items.join(' ');
        }
        if (block.type === 'grid' || block.type === 'column') {
            return extractTextFromBlocks(block.children || []);
        }
        if (block.type === 'table') {
            return block.content.rows.flat().join(' ');
        }
        return '';
    }).join(' ');
};

export const generateSearchIndex = (): SearchIndexItem[] => {
    return Object.keys(contentModules).map((path) => {
        const module = contentModules[path] as { default: DocPage };
        const data = module.default;
        const filename = path.split('/').pop()?.replace('.json', '') || '';
        const categoryFolders = path.split('/');
        const folderCategory = categoryFolders[categoryFolders.length - 2];

        // Extract content from all steps
        const fullContent = data.steps.map(step => {
            return `${step.title} ${step.content || ''} ${extractTextFromBlocks(step.blocks || [])}`;
        }).join(' ');

        // Strip HTML tags for cleaner search
        const cleanContent = fullContent.replace(/<[^>]*>/g, ' ');

        return {
            title: data.title,
            description: data.description,
            path: `/docs/${folderCategory}/${filename}`, // Generate correct path
            category: folderCategory,
            keywords: [
                ...data.title.toLowerCase().split(' '),
                folderCategory.toLowerCase(),
                ...(data.metadata?.tags || []) // Assume tags might be added later
            ],
            content: cleanContent
        };
    });
};

export interface SearchIndexItem {
    title: string;
    description: string;
    path: string;
    category: string;
    keywords: string[];
    content: string; // Full text content
}

export const getAllDocs = (): DocWithContent[] => {
    return Object.keys(contentModules).map((path) => {
        // Cast the module to have a default export of type DocPage
        const module = contentModules[path] as { default: DocPage };
        const data = module.default;

        // Extract slug from filename (e.g. "../content/quickstart/unboxing-setup.json" -> "unboxing-setup")
        const slug = path.split('/').pop()?.replace('.json', '') || '';
        // Extract category from folder name (e.g. "quickstart")
        const categoryFolders = path.split('/');
        const folderCategory = categoryFolders[categoryFolders.length - 2];

        return {
            ...data, // Spread all original data (steps, blocks, etc.)
            id: data.id || slug,
            title: data.title,
            description: data.description,
            category: folderCategory, // Use folder name as reliable category key
            path: `/docs/${folderCategory}/${slug}`,
            metadata: data.metadata || { difficulty: 'Unknown', readTime: '5 min', lastUpdated: 'Today' }
        };
    });
};

export const getDocsByCategory = (category: string): DocSummary[] => {
    const allDocs = getAllDocs();
    return allDocs.filter(doc => doc.category.toLowerCase() === category.toLowerCase());
};
