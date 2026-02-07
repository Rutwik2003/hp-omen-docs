import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getStepIllustration } from './PageIllustrations';

interface StepSectionProps {
  number: number | string;
  title: string;
  children: React.ReactNode;
}

const StepSection: React.FC<StepSectionProps> = ({ number, title, children }) => {
  // Get relevant illustration for this step
  const Illustration = getStepIllustration(title);
  const containerRef = useRef<HTMLElement>(null);
  const [illustrationSize, setIllustrationSize] = useState<'sm' | 'md' | 'lg'>('lg');
  
  // Measure container height and adjust illustration size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        // Small container (< 150px) -> small icon
        // Medium container (150-250px) -> medium icon
        // Large container (> 250px) -> large icon
        if (height < 150) {
          setIllustrationSize('sm');
        } else if (height < 250) {
          setIllustrationSize('md');
        } else {
          setIllustrationSize('lg');
        }
      }
    };
    
    // Initial measurement
    updateSize();
    
    // Re-measure on resize
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [children]);
  
  return (
    <motion.section 
      ref={containerRef}
      aria-label={`Step ${number}: ${title}`}
      className="relative bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-700/50 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 overflow-hidden group"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: typeof number === 'number' ? number * 0.05 : 0
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-red-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      
      {/* Step indicator line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 via-red-500/30 to-transparent rounded-l-2xl" />

      {/* Inline Illustration - positioned in top right corner with gradient fade */}
      {Illustration && (
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none hidden lg:block">
          {/* Gradient mask - fades from visible at top-right to invisible towards bottom */}
          <div 
            className="absolute top-4 right-4 flex items-start justify-end"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)',
            }}
          >
            <motion.div
              className="opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              whileInView={{ opacity: 0.4, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Illustration size={illustrationSize} />
            </motion.div>
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
        {/* Custom OMEN-themed step badge - matches container style */}
        <motion.div 
          className="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Main badge - dark with orange tint */}
          <div className="relative w-full h-full bg-gradient-to-br from-orange-950/90 to-gray-900/90 rounded-xl border border-orange-500/30 backdrop-blur-sm">
            {/* Number */}
            <span className="absolute inset-0 flex items-center justify-center text-orange-400 font-bold text-base sm:text-lg tabular-nums">
              {number}
            </span>
          </div>
        </motion.div>
        <div className="flex-1 pt-1 sm:pt-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{title}</h2>
        </div>
      </div>
      <div className="pl-0 sm:pl-14 md:pl-16 text-gray-300 space-y-4 relative z-10">
        {children}
      </div>
    </motion.section>
  );
};

export default StepSection;
