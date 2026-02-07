import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Block, CalloutBlock, CodeBlock as CodeBlockType, ColumnBlock, GridBlock, ImageBlock, TableBlock } from '../../types/blocks';
import { InfoBox } from './index';
import { sanitizeHtml } from '../../utils/markdown';
import EnhancedCodeBlock from '../common/EnhancedCodeBlock';

interface PublicBlockRendererProps {
  block: Block;
}

// Memoized grid card component
const GridCard = memo<{ children: React.ReactNode; index: number }>(({ children, index }) => (
  <motion.div 
    className="flex flex-col gap-2 min-w-0 p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    {children}
  </motion.div>
));

GridCard.displayName = 'GridCard';

const PublicBlockRenderer = memo<PublicBlockRendererProps>(({ block }) => {
  switch (block.type) {
    case 'text':
    case 'heading':
      return (
        <motion.div 
          className="prose prose-invert max-w-none text-gray-300 mb-2 break-words leading-relaxed"
          dangerouslySetInnerHTML={sanitizeHtml('content' in block ? (block.content || '') : '')} 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
      );
    
    case 'code': {
      const codeBlock = block as CodeBlockType;
      return <EnhancedCodeBlock code={codeBlock.code} language={codeBlock.language} />;
    }

    case 'callout': {
       const callout = block as CalloutBlock;
       return (
         <motion.div
           initial={{ opacity: 0, x: -8 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
         >
           <InfoBox type={callout.variant || 'info'} title={callout.title}>
              <div dangerouslySetInnerHTML={sanitizeHtml(callout.content || '')} />
           </InfoBox>
         </motion.div>
       );
    }

    case 'grid': {
        const grid = block as GridBlock;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {grid.children?.map((col: ColumnBlock, index: number) => (
                    <GridCard key={col.id} index={index}>
                         {col.children?.map((child: Block) => (
                             <PublicBlockRenderer key={child.id} block={child} />
                         ))}
                    </GridCard>
                ))}
            </div>
        );
    }

    case 'table': {
        const table = block as TableBlock;
        return (
            <motion.div 
              className="overflow-x-auto rounded-xl border border-gray-700/50 mb-4 bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
                <table className="w-full text-left text-sm">
                    {table.content?.headers && (
                        <thead className="bg-gradient-to-r from-orange-500/10 to-red-500/10 text-gray-200 font-medium">
                            <tr>
                                {table.content.headers.map((h: string, i: number) => (
                                    <th key={i} className="p-4 border-b border-gray-700/50 first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-gray-800/50">
                        {table.content?.rows?.map((row: string[], rIndex: number) => (
                             <tr key={rIndex} className="hover:bg-white/5 transition-colors">
                                 {row.map((cell: string, cIndex: number) => (
                                     <td key={cIndex} className="p-4 text-gray-300">{cell}</td>
                                 ))}
                             </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        );
    }

    case 'image': {
        const image = block as ImageBlock;
        return (
            <motion.div 
              className="mb-4 w-fit max-w-full mx-auto rounded-xl overflow-hidden border border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
                {image.url ? (
                    <img 
                        src={image.url} 
                        alt={image.alt || 'Content image'} 
                        className="max-w-full h-auto object-contain max-h-[500px]"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-32 flex items-center justify-center text-gray-500 italic">No image source</div>
                )}
                {image.caption && (
                    <div className="p-3 text-center text-sm text-gray-400 bg-black/40 border-t border-gray-800">
                        {image.caption}
                    </div>
                )}
            </motion.div>
        );
    }

    default:
        return null;
  }
});

PublicBlockRenderer.displayName = 'PublicBlockRenderer';

export default PublicBlockRenderer;
