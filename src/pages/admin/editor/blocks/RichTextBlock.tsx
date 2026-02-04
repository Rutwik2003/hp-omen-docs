import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { useEditorStore } from '../../../../store/editorStore';
import { Block } from '../../../../types/blocks';

import SlashCommandMenu from '../SlashCommandMenu';
import { useState } from 'react';

const RichTextBlock = ({ stepId, block }: { stepId: string; block: Block }) => {
  const { updateBlock } = useEditorStore();
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  
  const editor = useEditor({
    extensions: [
      // StarterKit v3 includes Link by default - configure it here
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      Image,
    ],
    content: (block as any).content || '',
    editorProps: {
        attributes: {
            class: 'prose prose-invert max-w-none w-full break-words focus:outline-none min-h-[1.5em]',
        },
        handleKeyDown: (view, event) => {
            if (event.key === '/') {
                const { top, left } = view.coordsAtPos(view.state.selection.from);
                setMenuPosition({ top: top + 20, left });
                return false; // Let strict '/' be typed
            }
            if (menuPosition && (event.key === 'Escape' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter')) {
                 return false; // Let Menu handle these
            }
            if (menuPosition) {
                setMenuPosition(null); // Close on other typing
            }
            return false;
        }
    },
    onUpdate: ({ editor }) => {
       const content = editor.getHTML();
       // If content is just '<p>/</p>', keep menu open, otherwise maybe specific check?
       // Actually simplest is 'handleKeyDown' sets it.
       // We update store
       updateBlock(stepId, block.id, { content });
    },
  });

  // Sync content... (existing useEffect)
  useEffect(() => {
    // Cast block to access content safely as not all blocks have 'content' string
    const content = (block as any).content;
    
    if (editor && content !== editor.getHTML()) {
        if (editor.getText() !== new DOMParser().parseFromString(content || '', 'text/html').body.textContent) {
             editor.commands.setContent(content);
        }
    }
  }, [(block as any).content, editor]);

  const handleSlashSelect = (type: any) => {
      setMenuPosition(null);
      
      // If we are converting the current block
      if (editor?.getText() === '/') {
          // Special case: converting this block
          // We need to essentially "replace" this block with a new one of 'type'
          // Since our store updateBlock is partial, we might not be able to fully change type structure easily if it's radically different (like grid) without cleanup.
          // Safer strategy: Remove this block, Add new block at same index? 
          // But we don't have index here easily.
          // Alternative: updateBlock with new type and defaults.
          
          let newBlockData: any = { type };
          if (type === 'code') newBlockData = { type: 'code', language: 'javascript', code: '' };
          if (type === 'grid') newBlockData = { type: 'grid', columns: 2, children: [] /* needing init? */ };
          // Grid actually needs children init structure likely handled by a factory or store.
          
          // Actually, let's use a "replace" strategy if possible? 
          // Or just updateBlock.
          // Warning: TipTap might freak out if we unmount.
          
          // Strategy: Clear content of this block (remove '/'), then insert NEW block after it?
          // No, user expects replacement.
          
          // Let's try simple update for now, relying on BlockRenderer to switch component.
          // We must ensure the new data satisfies the type.
          if (type === 'grid') {
             // Grid requires complexity.
             // Maybe notify user "Add Grid via button" for now? 
             // Or construct it.
             newBlockData = { 
                 type: 'grid', 
                 columns: 2, 
                 children: [
                    { id: crypto.randomUUID(), type: 'column', children: [] },
                    { id: crypto.randomUUID(), type: 'column', children: [] }
                 ]
             };
          }
          if (type === 'table') {
              newBlockData = { type: 'table', content: { headers: ['Col 1', 'Col 2'], rows: [['', '']] } };
          }
          if (type === 'image') newBlockData = { type: 'image', url: '' };

          updateBlock(stepId, block.id, newBlockData as any);
      } else {
          // If inserting *after* text?
          // For now, only support "replace if emptyish"
          editor?.commands.clearContent();
      }
  };

  if (!editor) return null;

  return (
    <div className="relative">
       <SlashCommandMenu 
            position={menuPosition} 
            onSelect={handleSlashSelect} 
            onClose={() => setMenuPosition(null)} 
       />
       <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextBlock;
