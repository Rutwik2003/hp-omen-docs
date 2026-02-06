/**
 * All available block types in the guide editor.
 * Each type corresponds to a specific Block interface.
 */
export type BlockType =
    | 'text'
    | 'heading'
    | 'image'
    | 'video'
    | 'code'
    | 'callout'
    | 'grid'
    | 'column'
    | 'table'
    | 'divider'
    | 'list';

/**
 * Base properties shared by all block types.
 */
export interface BaseBlock {
    /** Unique identifier (UUID) for the block */
    id: string;
    /** Discriminator for block type */
    type: BlockType;
    /** Parent block ID when nested inside Grid/Column */
    parentId?: string;
}

/** Rich text block using TipTap editor */
export interface TextBlock extends BaseBlock {
    type: 'text';
    /** TipTap HTML content */
    content: string;
}

/** Section heading block */
export interface HeadingBlock extends BaseBlock {
    type: 'heading';
    content: string;
    /** Heading level: 1 = h1, 2 = h2, 3 = h3 */
    level: 1 | 2 | 3;
}

/** Image block with optional caption */
export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    caption?: string;
    alt?: string;
}

/** Embedded video block */
/** Embedded video block */
export interface VideoBlock extends BaseBlock {
    type: 'video';
    url: string;
    /** Video platform for proper embedding */
    provider: 'youtube' | 'vimeo' | 'custom';
}

/** Syntax-highlighted code block */
export interface CodeBlock extends BaseBlock {
    type: 'code';
    /** Programming language for syntax highlighting */
    language: string;
    code: string;
    /** Optional filename displayed above code */
    filename?: string;
}

/** Callout/alert box for important information */
export interface CalloutBlock extends BaseBlock {
    type: 'callout';
    /** Visual style: info (blue), warning (yellow), tip (purple), danger (red) */
    variant: 'info' | 'warning' | 'tip' | 'danger';
    title?: string;
    /** HTML content inside callout */
    content: string;
}

/** Column container inside a Grid block */
export interface ColumnBlock extends BaseBlock {
    type: 'column';
    /** Nested blocks inside this column */
    children: Block[];
}

/** Multi-column grid layout container */
export interface GridBlock extends BaseBlock {
    type: 'grid';
    /** Number of columns (2 or more) */
    columns: number;
    /** Column blocks containing nested content */
    children: ColumnBlock[];
}

/** Data table with headers and rows */
export interface TableBlock extends BaseBlock {
    type: 'table';
    content: {
        headers: string[];
        rows: string[][];
    };
}

/** List block for ordered or unordered lists */
export interface ListBlock extends BaseBlock {
    type: 'list';
    content: {
        /** List style: ordered (numbered) or unordered (bullets) */
        style: 'ordered' | 'unordered';
        /** List items as strings (can contain HTML) */
        items: string[];
    };
}

/**
 * Union type of all possible block types.
 * Used throughout the editor for type-safe block handling.
 */
export type Block =
    | TextBlock
    | HeadingBlock
    | ImageBlock
    | VideoBlock
    | CodeBlock
    | CalloutBlock
    | GridBlock
    | ColumnBlock
    | TableBlock
    | ListBlock;

/**
 * A single step in a guide, containing a title and array of content blocks.
 */
export interface GuideStep {
    /** Unique identifier (UUID) */
    id: string;
    title: string;
    /** Root-level blocks for this step's content */
    blocks: Block[];
}
