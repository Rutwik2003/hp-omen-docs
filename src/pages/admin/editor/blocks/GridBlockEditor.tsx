import React from 'react';
import { GridBlock } from '../../../../types/blocks';
import BlockList from './BlockList';
import { Columns } from 'lucide-react';

interface GridBlockEditorProps {
  stepId: string;
  block: GridBlock;
}

const GridBlockEditor: React.FC<GridBlockEditorProps> = ({ stepId, block }) => {
  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
        {/* Header/Controls */}
        <div className="bg-neutral-900/50 p-2 border-b border-neutral-800 flex items-center gap-2 text-xs text-neutral-400">
            <Columns className="w-3 h-3" />
            <span>Grid Layout ({block.columns} Columns)</span>
            {/* TODO: Add controls to change column count */}
        </div>

        {/* Columns Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {block.children.map((column, index) => (
                <div key={column.id} className="flex flex-col gap-2 min-w-0 pl-12 border-l border-white/5 relative">
                     <div className="text-xs uppercase font-mono text-neutral-600 mb-1">Column {index + 1}</div>
                     <BlockList 
                        stepId={stepId} 
                        parentId={column.id} 
                        initialBlocks={column.children}
                     />
                </div>
            ))}
        </div>
    </div>
  );
};

export default GridBlockEditor;
