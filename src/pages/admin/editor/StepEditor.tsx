import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash } from 'lucide-react';
import { GuideStep } from '../../../types/docs';
import BlockList from './blocks/BlockList';
import { useEditorStore } from '../../../store/editorStore';

interface ExtendedStep extends GuideStep {
  id: string; // Keep ID for DnD
}

interface StepEditorProps {
  step: ExtendedStep;
  index: number;
}

const StepEditor: React.FC<StepEditorProps> = ({ step, index }) => {
  const updateStepTitle = useEditorStore((s) => s.updateStepTitle);
  const removeStep = useEditorStore((s) => s.removeStep);

  return (
    <Draggable draggableId={step.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-neutral-900 border ${snapshot.isDragging ? 'border-orange-500 shadow-xl scale-[1.02] z-50' : 'border-neutral-800'} rounded-xl overflow-hidden transition-all mb-6 group`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Header */}
          <div className="bg-neutral-800/50 p-2 sm:p-4 flex items-center gap-2 sm:gap-4 border-b border-neutral-800 select-none">
             <div 
                {...provided.dragHandleProps}
                className="cursor-grab hover:text-orange-500 text-neutral-600 transition-colors p-1.5 sm:p-2 hover:bg-white/5 rounded" 
             >
                <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
             </div>
             
             <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700 text-neutral-400 font-mono text-xs sm:text-sm">
                {index + 1}
             </div>

             <div className="flex-1 min-w-0">
                <input 
                    value={step.title}
                    onChange={e => updateStepTitle(step.id, e.target.value)}
                    className="bg-transparent border-none text-white font-bold text-base sm:text-lg focus:ring-0 w-full focus:text-orange-400 p-0 placeholder-neutral-600 truncate"
                    placeholder="Step Title"
                />
             </div>

             <button 
                onClick={() => removeStep(step.id)} 
                className="p-1.5 sm:p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                aria-label={`Delete step ${index + 1}: ${step.title || 'Untitled'}`}
             >
                <Trash className="w-4 h-4" aria-hidden="true" />
             </button>
          </div>

          {/* Block Editor Content Area */}
          <div className="pl-3 sm:pl-6 lg:pl-12 pr-2 sm:pr-4 py-3 sm:py-4 bg-black/20">
             <BlockList stepId={step.id} initialBlocks={step.blocks || []} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default StepEditor;

