import React, { useState } from 'react';
import { ExternalLink, Image } from 'lucide-react';
import { useEditorStore } from '../../../../store/editorStore';
import { ImageBlock } from '../../../../types/blocks';

interface ImageBlockEditorProps {
  stepId: string;
  block: ImageBlock;
}

const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ stepId, block }) => {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const [isValid, setIsValid] = useState(true);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-black group">
        {/* Preview Area */}
        <div className="relative min-h-[200px] bg-neutral-900/50 flex items-center justify-center border-b border-neutral-800">
            {block.url ? (
                <img 
                    src={block.url} 
                    alt={block.alt || 'Guide image'} 
                    className="max-w-full max-h-[400px] object-contain"
                    onError={() => setIsValid(false)}
                />
            ) : (
                <div className="text-neutral-600 flex flex-col items-center">
                    <Image className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm">No image provided</span>
                </div>
            )}
            
            {!isValid && block.url && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400">
                     <span>Failed to load image</span>
                 </div>
            )}
        </div>

        {/* Controls */}
        <div className="p-3 space-y-3 bg-neutral-900/30">
            {/* URL Input */}
            <div className="flex items-center gap-2">
                <div className="bg-neutral-800 p-2 rounded text-neutral-400">
                    <ExternalLink className="w-4 h-4" />
                </div>
                <input 
                    value={block.url || ''}
                    onChange={(e) => {
                        setIsValid(true);
                        updateBlock(stepId, block.id, { url: e.target.value });
                    }}
                    className="flex-1 bg-transparent border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none transition-colors placeholder-neutral-600"
                    placeholder="Paste image URL here..."
                />
            </div>

            {/* Caption & Alt */}
            <div className="grid grid-cols-2 gap-3">
                <input 
                    value={block.caption || ''}
                    onChange={(e) => updateBlock(stepId, block.id, { caption: e.target.value })}
                    className="bg-transparent border-b border-neutral-800 py-1 text-xs text-neutral-400 focus:text-white focus:border-orange-500/50 focus:outline-none"
                    placeholder="Caption (optional)"
                />
                 <input 
                    value={block.alt || ''}
                    onChange={(e) => updateBlock(stepId, block.id, { alt: e.target.value })}
                    className="bg-transparent border-b border-neutral-800 py-1 text-xs text-neutral-400 focus:text-white focus:border-orange-500/50 focus:outline-none"
                    placeholder="Alt Text (SEO)"
                />
            </div>
        </div>
    </div>
  );
};

export default ImageBlockEditor;
