import React from 'react';
import DOMPurify from 'dompurify';
import { Block } from '../../types/blocks';
import { InfoBox } from './index';

interface PublicBlockRendererProps {
  block: Block;
}

const sanitize = (content: string) => ({
  __html: DOMPurify.sanitize(content, { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
  })
});

const PublicBlockRenderer: React.FC<PublicBlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'text':
    case 'heading':
      return (
        <div 
            className="prose prose-invert max-w-none text-gray-300 mb-2 break-words"
            dangerouslySetInnerHTML={sanitize((block as any).content || '')} 
        />
      );
    
    case 'code':
      const codeBlock = block as any;
      return (
        <div className="bg-black border border-gray-800 rounded-lg p-4 font-mono text-sm mb-4 flex justify-between items-center group relative overflow-hidden">
          <code className="text-green-400 block whitespace-pre overflow-x-auto min-w-0">
            {codeBlock.code}
          </code>
          <button 
             onClick={() => navigator.clipboard.writeText(codeBlock.code)}
             className="absolute right-4 top-4 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
             Copy
          </button>
        </div>
      );

    case 'callout':
       const callout = block as any;
       return (
         <InfoBox type={callout.variant || 'info'} title={callout.title}>
            <div dangerouslySetInnerHTML={sanitize(callout.content || '')} />
         </InfoBox>
       );

    case 'grid':
        const grid = block as any;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {grid.children?.map((col: any) => (
                    <div key={col.id} className="flex flex-col gap-2 min-w-0">
                         {col.children?.map((child: Block) => (
                             <PublicBlockRenderer key={child.id} block={child} />
                         ))}
                    </div>
                ))}
            </div>
        );

    case 'table':
        const table = block as any;
        return (
            <div className="overflow-x-auto rounded-lg border border-neutral-800 mb-4 bg-black/20">
                <table className="w-full text-left text-sm">
                    {table.content?.headers && (
                        <thead className="bg-neutral-800/50 text-neutral-400 font-medium">
                            <tr>
                                {table.content.headers.map((h: string, i: number) => (
                                    <th key={i} className="p-3 border-b border-neutral-800">{h}</th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-neutral-800/50">
                        {table.content?.rows?.map((row: string[], rIndex: number) => (
                             <tr key={rIndex} className="hover:bg-white/5 transition-colors">
                                 {row.map((cell: string, cIndex: number) => (
                                     <td key={cIndex} className="p-3 text-neutral-300">{cell}</td>
                                 ))}
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    case 'image':
        const image = block as any;
        return (
            <div className="mb-4 rounded-lg overflow-hidden border border-neutral-800 bg-black/40">
                {image.url ? (
                    <img 
                        src={image.url} 
                        alt={image.alt || 'Content image'} 
                        className="w-full h-auto object-contain max-h-[500px]"
                    />
                ) : (
                    <div className="h-32 flex items-center justify-center text-neutral-600 italic">No image source</div>
                )}
                {image.caption && (
                    <div className="p-2 text-center text-xs text-neutral-500 bg-black/20 border-t border-neutral-800">
                        {image.caption}
                    </div>
                )}
            </div>
        );

    default:
        return null;
  }
};

export default PublicBlockRenderer;
