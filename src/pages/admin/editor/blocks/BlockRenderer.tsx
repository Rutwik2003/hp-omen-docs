import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Block, CalloutBlock, CodeBlock, GridBlock, ImageBlock, TableBlock } from '../../../../types/blocks';
import { useEditorStore } from '../../../../store/editorStore';
import { devLog } from '../../../../utils/logger';
import RichTextBlock from './RichTextBlock';
import CodeBlockEditor from './CodeBlockEditor';
import CalloutBlockEditor from './CalloutBlockEditor';
import GridBlockEditor from './GridBlockEditor';
import TableBlockEditor from './TableBlockEditor';
import ImageBlockEditor from './ImageBlockEditor';

interface BlockRendererProps {
  stepId: string;
  block: Block;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  level?: number;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ stepId, block, dragHandleProps, level = 0 }) => {
  const { removeBlock } = useEditorStore();
  const isNested = level > 0;

  const renderContent = () => {
    switch (block.type) {
      case 'text':
      case 'heading':
        return <RichTextBlock stepId={stepId} block={block} />;
      case 'code':
        return <CodeBlockEditor stepId={stepId} block={block as CodeBlock} />;
      case 'callout':
        return <CalloutBlockEditor stepId={stepId} block={block as CalloutBlock} />;
      case 'grid':
        return <GridBlockEditor stepId={stepId} block={block as GridBlock} />;
      case 'table':
          return <TableBlockEditor stepId={stepId} block={block as TableBlock} />;
      case 'image':
          return <ImageBlockEditor stepId={stepId} block={block as ImageBlock} />;
      default:
        return <div className="text-red-500">Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div className={`group relative flex items-start ${isNested ? '' : ''} pr-1 sm:pr-4`}>
       {/* Hover Controls - Inline on mobile, absolute on desktop */}
       <div className={`flex-shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity sm:absolute sm:right-full ${isNested ? 'mr-0.5 sm:mr-1' : 'mr-1 sm:mr-2'} flex items-center sm:h-full pt-0.5 sm:pt-1.5 sm:top-0`}>
          <div className={`flex flex-col sm:${isNested ? 'flex-col' : 'flex-row'} bg-neutral-800 sm:bg-neutral-900 border border-neutral-700 rounded shadow-lg overflow-hidden`}>
             <button 
                {...dragHandleProps}
                className="p-1 sm:p-1.5 text-neutral-400 hover:text-white cursor-grab hover:bg-neutral-800"
                title="Drag to move"
                aria-label="Drag to reorder block"
             >
                <GripVertical className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
             </button>
             <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    devLog('Removing block', stepId, block.id);
                    removeBlock(stepId, block.id); 
                }}
                className="p-1 sm:p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                title="Delete block"
                aria-label="Delete this block"
             >
                <X className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
             </button>
          </div>
       </div>

       {/* Block Content */}
       <div className="flex-1 min-w-0">
           {renderContent()}
       </div>
    </div>
  );
};

export default BlockRenderer;
