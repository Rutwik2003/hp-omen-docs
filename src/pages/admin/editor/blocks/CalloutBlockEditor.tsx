import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Flame, Info, X } from 'lucide-react';
import { useEditorStore } from '../../../../store/editorStore';
import { CalloutBlock } from '../../../../types/blocks';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const CalloutBlockEditor = ({ stepId, block }: { stepId: string; block: CalloutBlock }) => {
  const { updateBlock } = useEditorStore();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: block.content || '',
    editorProps: {
        attributes: {
            class: 'prose prose-invert max-w-none w-full break-words focus:outline-none min-h-[60px] text-sm text-white/90',
        },
    },
    onUpdate: ({ editor }) => {
       updateBlock(stepId, block.id, { content: editor.getHTML() } as any);
    },
  });

  // Sync content with external updates
  React.useEffect(() => {
    if (editor && block.content !== editor.getHTML()) {
        const currentContent = editor.getHTML();
        if (currentContent !== block.content) {
             // Only update if strictly different to avoid cursor jumps, 
             // though Tiptap usually handles simple setContent well.
             // But strict check:
             // To match RichTextBlock logic roughly:
             if (editor.getText() !== new DOMParser().parseFromString(block.content || '', 'text/html').body.textContent) {
                 editor.commands.setContent(block.content);
             }
        }
    }
  }, [block.content, editor]);

  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variants = {
      info: { icon: Info, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
      warning: { icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
      success: { icon: CheckCircle, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
      danger: { icon: Flame, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
      tip: { icon: Info, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  };

  const current = variants[block.variant || 'info'] || variants.info;
  const Icon = current.icon;

  const options = ['info', 'tip', 'warning', 'success', 'danger'];

  return (
    <div className={`border rounded-lg overflow-hidden ${current.border} ${current.bg}`}>
        <div className="flex items-center gap-3 p-3 border-b border-white/5">
            <Icon className={`w-4 h-4 ${current.color}`} />
            <input 
                value={block.title || ''}
                onChange={(e) => updateBlock(stepId, block.id, { title: e.target.value } as any)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none w-full placeholder-white/20"
                placeholder="Callout Title (Optional)"
            />
            
            {/* Custom Compact Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 rounded px-2 py-1 text-xs text-white/90 transition-all uppercase font-medium tracking-wide"
                >
                    {block.variant || 'info'}
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    updateBlock(stepId, block.id, { variant: opt } as any);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs uppercase font-medium tracking-wide hover:bg-white/5 transition-colors flex items-center justify-between ${
                                    block.variant === opt ? 'text-orange-400 bg-orange-500/10' : 'text-gray-400'
                                }`}
                            >
                                {opt}
                                {block.variant === opt && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="p-3">
             <EditorContent editor={editor} />
        </div>
    </div>
  );
};

export default CalloutBlockEditor;
