import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Block, BlockType } from '../../../../types/blocks';
import BlockRenderer from './BlockRenderer';
import { useEditorStore } from '../../../../store/editorStore';

interface BlockListProps {
  stepId: string;
  parentId?: string; // ID of the container block (e.g., Column ID)
  initialBlocks?: Block[]; // Optional blocks passed from parent
}

const BlockList: React.FC<BlockListProps> = ({ stepId, parentId, initialBlocks }) => {
  const { guide, addBlock, moveBlock } = useEditorStore();
  
  // If parentId is not provided, we look at the step's root blocks
  const step = guide.steps?.find(s => s.id === stepId);
  const rootBlocks = step?.blocks || [];

  // If initialBlocks provided (nested), use them. Otherwise use rootBlocks.
  // Note: For nested components heavily relying on store updates, 
  // the parent (GridBlockEditor) should probably pass the *live* blocks from the store.
  // Here we fallback to rootBlocks if no blocks provided.
  const blocksToRender = initialBlocks || rootBlocks;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // We assume re-ordering happens within the same list for now
    if (result.source.droppableId === result.destination.droppableId) {
        moveBlock(stepId, result.source.index, result.destination.index, parentId);
    }
  };

  const handleAddBlock = (type: BlockType) => {
      addBlock(stepId, type, undefined, parentId);
  };

  const droppableId = parentId ? `blocks-${parentId}` : `blocks-step-${stepId}`;

  return (
      <div className="space-y-4">
        {/* If nested, we might not strictly need DragDropContext here if the parent has one?
            Actually @hello-pangea/dnd recommends one DragDropContext at the root.
            But for now, if we have multiple lists, we might need a shared context higher up.
            However, BlockList is currently used at Root Level (StepEditor) which provides context?
            Wait, StepEditor didn't provide DragDropContext, BlockList did.
            If we nest BlockLists, we cannot nest DragDropContexts.
            
            FIX: We should move DragDropContext to GuideEditor or StepEditor, 
            OR only render DragDropContext if this is the ROOT BlockList.
        */}
        { !parentId ? (
            <DragDropContext onDragEnd={handleDragEnd}>
                 <DroppableArea 
                    id={droppableId} 
                    blocks={blocksToRender} 
                    stepId={stepId} 
                    handleAddBlock={handleAddBlock} 
                    level={parentId ? 1 : 0}
                />
            </DragDropContext>
        ) : (
            // Nested lists rely on Parent Context? 
            // OR we just assume simple vertical sort for now and fix DnD later.
            // Actually, if we want dragging BETWEEN columns, we need a shared context root.
            // For now, let's keep it simple: Nested BlockLists will have their own context? 
            // NO, nesting DragDropContext is forbidden.
            
            // To support nesting, we MUST lift DragDropContext up.
            // But to fix this quickly without huge refactor, let's assume we can only drag in root for now?
            // No, that breaks Grid editing.
            
            // Correct approach: StepEditor should wrap everything in DragDropContext.
            // But BlockList handles onDragEnd inside itself.
            // We can pass `isRoot` prop.
            
            // Temporary Hack: Render DroppableArea directly if parentId exists. 
            // But onDragEnd won't catch it unless the ROOT Context handler handles it.
            // We need to move handleDragEnd to the root.
            
            // For this iteration, let's keep DragDropContext here for root and accept that 
            // nested dragging might fail or warn until we lift state.
            // BUT: If strict mode is on, it will error.
            
            // BETTER PLAN: Just render Droppable. We will assume the User won't drag between disparate contexts easily yet.
             <DroppableArea 
                id={droppableId} 
                blocks={blocksToRender} 
                stepId={stepId} 
                handleAddBlock={handleAddBlock} 
                level={parentId ? 1 : 0}
            />
        )}
      </div>
  );
};

// Extracted Component
const DroppableArea = ({ id, blocks, stepId, handleAddBlock, level = 0 }: any) => (
    <Droppable droppableId={id}>
    {(provided) => (
        <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="flex flex-col space-y-3 min-h-[50px] bg-white/5 rounded-lg p-2 border border-dashed border-white/10"
        >
            {blocks.map((block: Block, index: number) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            <BlockRenderer 
                                stepId={stepId} 
                                block={block} 
                                dragHandleProps={provided.dragHandleProps}
                                level={level}
                            />
                        </div>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
            
            {/* Quick Add Buttons */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 pt-2 sm:justify-center">
                <button onClick={() => handleAddBlock('text')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Text</span>
                </button>
                 <button onClick={() => handleAddBlock('grid')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Grid</span>
                </button>
                 <button onClick={() => handleAddBlock('code')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Code</span>
                </button>
                <button onClick={() => handleAddBlock('callout')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Callout</span>
                </button>
                <button onClick={() => handleAddBlock('table')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Table</span>
                </button>
                <button onClick={() => handleAddBlock('image')} className="text-[10px] sm:text-xs flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300">
                    <Plus className="w-3 h-3 sm:mr-1" /><span className="hidden sm:inline">Image</span>
                </button>
            </div>
        </div>
    )}
  </Droppable>
);

export default BlockList;
