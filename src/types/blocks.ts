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
    | 'divider';

export interface BaseBlock {
    id: string;
    type: BlockType;
    parentId?: string; // ID of the parent block (e.g., for Grid columns)
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    content: string; // TipTap HTML
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading';
    content: string;
    level: 1 | 2 | 3;
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    caption?: string;
    alt?: string;
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    url: string;
    provider: 'youtube' | 'vimeo' | 'custom';
}

export interface CodeBlock extends BaseBlock {
    type: 'code';
    language: string;
    code: string;
    filename?: string;
}

export interface CalloutBlock extends BaseBlock {
    type: 'callout';
    variant: 'info' | 'warning' | 'tip' | 'danger';
    title?: string;
    content: string; // HTML
}

export interface ColumnBlock extends BaseBlock {
    type: 'column';
    children: Block[];
}

export interface GridBlock extends BaseBlock {
    type: 'grid';
    columns: number;
    children: ColumnBlock[];
}

export interface TableBlock extends BaseBlock {
    type: 'table';
    content: {
        headers: string[];
        rows: string[][];
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    caption?: string;
    alt?: string;
}

export type Block =
    | TextBlock
    | HeadingBlock
    | ImageBlock
    | VideoBlock
    | CodeBlock
    | CalloutBlock
    | GridBlock
    | ColumnBlock
    | TableBlock;

export interface GuideStep {
    id: string; // Step ID
    title: string;
    blocks: Block[]; // Root blocks for this step
}
