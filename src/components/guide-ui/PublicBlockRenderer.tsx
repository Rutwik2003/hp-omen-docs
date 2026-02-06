import React from 'react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { Block, CalloutBlock, CodeBlock as CodeBlockType, ColumnBlock, GridBlock, ImageBlock, TableBlock } from '../../types/blocks';
import { InfoBox } from './index';
import { Check, Copy, Terminal } from 'lucide-react';

interface PublicBlockRendererProps {
  block: Block;
}

// Enhanced markdown to HTML converter with visual improvements
const parseMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    // Bold: **text** or __text__ - with gradient styling
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*([^*]+)\*/g, '<em class="text-gray-200">$1</em>')
    .replace(/_([^_]+)_/g, '<em class="text-gray-200">$1</em>')
    // Inline code: `code` - enhanced pill style
    .replace(/`([^`]+)`/g, '<code class="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-2 py-0.5 rounded-md text-orange-300 text-sm font-mono border border-orange-500/30">$1</code>')
    // Links: [text](url) - with icon hint
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 underline decoration-orange-500/50 underline-offset-2 transition-colors">$1</a>')
    // Checkmark items: ✓ text - highlight
    .replace(/✓\s*([^<\n]+)/g, '<span class="inline-flex items-center gap-1"><span class="text-green-400">✓</span><span class="text-green-300">$1</span></span>');
};

const sanitize = (content: string) => ({
  __html: DOMPurify.sanitize(parseMarkdown(content), { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
  })
});

// Code block with syntax highlighting appearance
const EnhancedCodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="relative group mb-4 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-gray-400 font-medium">{language || 'Command'}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code content */}
      <div className="bg-black/80 backdrop-blur-sm p-4 border border-gray-800 border-t-0 rounded-b-xl">
        <code className="text-green-400 block whitespace-pre overflow-x-auto font-mono text-sm leading-relaxed">
          {code}
        </code>
      </div>
    </motion.div>
  );
};

// Enhanced grid card component
const GridCard: React.FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => (
  <motion.div 
    className="flex flex-col gap-2 min-w-0 p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    {children}
  </motion.div>
);

const PublicBlockRenderer: React.FC<PublicBlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'text':
    case 'heading':
      return (
        <motion.div 
          className="prose prose-invert max-w-none text-gray-300 mb-2 break-words leading-relaxed"
          dangerouslySetInnerHTML={sanitize('content' in block ? (block.content || '') : '')} 
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
              <div dangerouslySetInnerHTML={sanitize(callout.content || '')} />
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
};

export default PublicBlockRenderer;
