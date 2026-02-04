import React from 'react';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { StepSection, InfoBox, PrerequisitesList } from './index';
import { DocPage } from '../../types/docs';
import { Terminal, Copy, Check, ChevronRight, Sparkles } from 'lucide-react';
import PublicBlockRenderer from './PublicBlockRenderer';

interface DocRendererProps {
  data: Partial<DocPage>;
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
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 underline decoration-orange-500/50 underline-offset-2 transition-colors">$1</a>')
    // Checkmark items: ✓ text - highlight
    .replace(/✓\s*([^<\n]+)/g, '<span class="inline-flex items-center gap-1"><span class="text-green-400 font-bold">✓</span><span class="text-green-300">$1</span></span>')
    // Number prefix: 1. text -> styled number
    .replace(/^(\d+)\.\s+/gm, '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold mr-2">$1</span>')
    // Bullet points: • text -> styled bullets
    .replace(/•\s+/g, '<span class="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 align-middle"></span>');
};

// Enhanced code block component
const EnhancedCodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="relative group mb-6 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-gray-400 font-medium">Command / Code</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all border border-gray-600/50"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code content */}
      <div className="bg-black/90 backdrop-blur-sm p-4 border border-gray-800 border-t-0 rounded-b-xl">
        <code className="text-green-400 block whitespace-pre overflow-x-auto font-mono text-sm leading-relaxed">
          {code}
        </code>
      </div>
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none" />
    </motion.div>
  );
};

// Enhanced grid item card
const GridItemCard: React.FC<{ title?: string; content: string; index: number; sanitize: (content: string) => { __html: string } }> = ({ title, content, index, sanitize }) => (
  <motion.div 
    className="group bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-700/50 p-5 rounded-xl hover:border-orange-500/40 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
  >
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />
    
    {title && (
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-orange-400" />
        <h4 className="font-bold text-white">{title}</h4>
      </div>
    )}
    <div className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={sanitize(content)} />
  </motion.div>
);

const DocRenderer: React.FC<DocRendererProps> = ({ data }) => {
  const sanitize = (content: string) => ({
      __html: DOMPurify.sanitize(parseMarkdown(content), { 
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol', 'code', 'pre', 'span'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
      })
  });

  return (
    <div className="space-y-8">
      {/* Page-level Prerequisites */}
      {data.prerequisites && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <InfoBox 
              type={data.prerequisites.type || 'info'} 
              title={data.prerequisites.title || 'Prerequisites'}
          >
            <PrerequisitesList items={data.prerequisites.items} />
          </InfoBox>
        </motion.div>
      )}

      {/* Dynamic Steps */}
      {data.steps?.map((step, index) => (
        <StepSection key={index} number={index + 1} title={step.title}>
          
          {/* Modern Blocks Rendering */}
          {step.blocks && step.blocks.length > 0 ? (
              <div className="space-y-4">
                  {step.blocks.map(block => (
                      <PublicBlockRenderer key={block.id} block={block} />
                  ))}
              </div>
          ) : (
            <>
              {/* ENHANCED LEGACY RENDERING */}
              {/* Main Content with better typography */}
              <motion.div 
                className="text-gray-300 mb-6 space-y-4 prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-white"
                dangerouslySetInnerHTML={sanitize(step.content)} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              />
    
               {/* Enhanced Grid Layout */}
               {step.grid && (
                   <div className={`grid grid-cols-1 md:grid-cols-${step.grid.columns || 2} gap-4 mb-6`}>
                       {step.grid.items.map((item, i) => (
                           <GridItemCard 
                             key={i} 
                             title={item.title} 
                             content={item.content} 
                             index={i} 
                             sanitize={sanitize}
                           />
                       ))}
                   </div>
               )}
    
              {/* Enhanced Code Block */}
              {step.codeBlock && (
                <EnhancedCodeBlock code={step.codeBlock.code} />
              )}
    
              {/* Prerequisites/List inside a step */}
              {step.prerequisites && step.prerequisites.length > 0 && (
                 <motion.div 
                   className="bg-gradient-to-br from-gray-900/60 to-black/60 rounded-xl p-6 border border-gray-700/50 mb-4 backdrop-blur-sm"
                   initial={{ opacity: 0, y: 8 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                 >
                    <PrerequisitesList items={step.prerequisites} />
                 </motion.div>
              )}
    
              {/* InfoBox inside a step */}
              {step.infoBox && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <InfoBox 
                      type={step.infoBox.type} 
                      title={step.infoBox.title}
                  >
                    <div dangerouslySetInnerHTML={sanitize(step.infoBox.content)} />
                  </InfoBox>
                </motion.div>
              )}
            </>
          )}

        </StepSection>
      ))}
    </div>
  );
};

export default DocRenderer;
