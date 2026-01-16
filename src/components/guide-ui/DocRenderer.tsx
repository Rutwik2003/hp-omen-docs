import React from 'react';
import DOMPurify from 'dompurify';
import { StepSection, InfoBox, PrerequisitesList } from './index';
import { DocPage } from '../../types/docs';

interface DocRendererProps {
  data: Partial<DocPage>;
}

// ... imports ...
import PublicBlockRenderer from './PublicBlockRenderer';

// ... interface ...

const DocRenderer: React.FC<DocRendererProps> = ({ data }) => {
  const sanitize = (content: string) => ({
      __html: DOMPurify.sanitize(content, { 
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol', 'code', 'pre'],
          ALLOWED_ATTR: ['href', 'target', 'rel']
      })
  });

  return (
    <div className="space-y-12">
      {/* Page-level Prerequisites */}
      {data.prerequisites && (
        <InfoBox 
            type={data.prerequisites.type || 'info'} 
            title={data.prerequisites.title || 'Prerequisites'}
        >
          <PrerequisitesList items={data.prerequisites.items} />
        </InfoBox>
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
              {/* LEGACY RENDERING FALLBACK */}
              {/* Main Content */}
              <div 
                className="text-gray-300 mb-4 space-y-2 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={sanitize(step.content)} 
              />
    
               {/* Grid Layout Support */}
               {step.grid && (
                   <div className={`grid grid-cols-1 md:grid-cols-${step.grid.columns} gap-6 mb-6`}>
                       {step.grid.items.map((item, i) => (
                           <div key={i} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                               {item.title && <h4 className="font-bold text-white mb-2">{item.title}</h4>}
                               <div className="text-sm text-gray-400" dangerouslySetInnerHTML={sanitize(item.content)} />
                           </div>
                       ))}
                   </div>
               )}
    
              {/* Code Block */}
              {step.codeBlock && (
                <div className="bg-black border border-gray-800 rounded-lg p-4 font-mono text-sm mb-6 flex justify-between items-center group relative">
                  <code className="text-green-400 block whitespace-pre overflow-x-auto">
                    {step.codeBlock.code}
                  </code>
                  {step.codeBlock.copyable !== false && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(step.codeBlock!.code)}
                      className="absolute right-4 top-4 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Copy
                    </button>
                  )}
                </div>
              )}
    
              {/* Prerequisites/List inside a step */}
              {step.prerequisites && step.prerequisites.length > 0 && (
                 <div className="bg-black/30 rounded-xl p-6 border border-white/10 mb-4">
                    <PrerequisitesList items={step.prerequisites} />
                 </div>
              )}
    
              {/* InfoBox inside a step */}
              {step.infoBox && (
                <InfoBox 
                    type={step.infoBox.type} 
                    title={step.infoBox.title}
                >
                  <div dangerouslySetInnerHTML={sanitize(step.infoBox.content)} />
                </InfoBox>
              )}
            </>
          )}

        </StepSection>
      ))}
    </div>
  );
};



export default DocRenderer;
