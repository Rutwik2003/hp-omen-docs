import { memo } from 'react';
import { motion } from 'framer-motion';
import { InfoBox, PrerequisitesList, StepSection } from './index';
import { DocPage } from '../../types/docs';
import { Sparkles } from 'lucide-react';
import PublicBlockRenderer from './PublicBlockRenderer';
import { sanitizeHtml } from '../../utils/markdown';
import EnhancedCodeBlock from '../common/EnhancedCodeBlock';

// Grid columns mapping - Tailwind requires static class names
const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

interface DocRendererProps {
  data: Partial<DocPage>;
}

// Enhanced grid item card - memoized for performance
const GridItemCard = memo<{ title?: string; content: string; index: number }>(({ title, content, index }) => (
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
    <div className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={sanitizeHtml(content)} />
  </motion.div>
));

GridItemCard.displayName = 'GridItemCard';

const DocRenderer = memo<DocRendererProps>(({ data }) => {
  return (
    <div className="space-y-8">
      {/* Page-level Prerequisites - only render if items exist */}
      {data.prerequisites && data.prerequisites.items && data.prerequisites.items.length > 0 && (
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
        <StepSection key={step.id || index} number={index + 1} title={step.title}>
          
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
                dangerouslySetInnerHTML={sanitizeHtml(step.content)} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              />
    
               {/* Enhanced Grid Layout */}
               {step.grid && (
                   <div className={`grid ${gridColsMap[step.grid.columns || 2] || gridColsMap[2]} gap-3 sm:gap-4 mb-6`}>
                       {step.grid.items.map((item, i) => (
                           <GridItemCard 
                             key={item.title || i} 
                             title={item.title} 
                             content={item.content} 
                             index={i} 
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
                    <div dangerouslySetInnerHTML={sanitizeHtml(step.infoBox.content)} />
                  </InfoBox>
                </motion.div>
              )}
            </>
          )}

        </StepSection>
      ))}
    </div>
  );
});

DocRenderer.displayName = 'DocRenderer';

export default DocRenderer;
