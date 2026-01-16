import React from 'react';
import Editor from 'react-simple-code-editor';
import { useEditorStore } from '../../../../store/editorStore';
import { CodeBlock } from '../../../../types/blocks';

const CodeBlockEditor = ({ stepId, block }: { stepId: string; block: CodeBlock }) => {
  const { updateBlock } = useEditorStore();

  return (
    <div className="bg-black border border-neutral-800 rounded-lg overflow-hidden group">
      <div className="bg-neutral-900 border-b border-neutral-800 px-3 py-1 flex items-center justify-between">
          <span className="text-xs text-neutral-500 font-mono">CODE</span>
          <input 
             value={block.language}
             onChange={(e) => updateBlock(stepId, block.id, { language: e.target.value } as any)}
             className="bg-transparent text-xs text-neutral-400 text-right focus:outline-none focus:text-white w-20"
             placeholder="Language"
          />
      </div>
      <textarea 
         value={block.code}
         onChange={(e) => updateBlock(stepId, block.id, { code: e.target.value } as any)}
         className="w-full bg-black p-3 text-sm font-mono text-green-400 focus:outline-none resize-y min-h-[80px]"
         placeholder="// Type your code here..."
      />
    </div>
  );
};

export default CodeBlockEditor;
