/**
 * Consolidated Animation Components
 * 
 * This file combines all animation utilities into a single, well-organized module.
 * Uses framer-motion for smooth, performant animations.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

type Direction = 'up' | 'down' | 'left' | 'right';
type AnimationType = 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';

interface BaseAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

interface StaggerContainerProps extends BaseAnimationProps {
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<BaseAnimationProps> = ({ 
  children, 
  className = '',
  delay = 0
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }
      }
    }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

interface FadeInProps extends BaseAnimationProps {
  direction?: Direction;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 30, x: 0 };
      case 'down': return { y: -30, x: 0 };
      case 'left': return { x: -30, y: 0 };
      case 'right': return { x: 30, y: 0 };
      default: return { y: 30, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Variant version for use inside StaggerContainer
export const FadeInItem: React.FC<FadeInProps> = ({ 
  children, 
  className = '', 
  direction = 'up',
  delay = 0 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 40, x: 0 };
      case 'down': return { y: -40, x: 0 };
      case 'left': return { x: -40, y: 0 };
      case 'right': return { x: 40, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          ...getInitialPosition(),
          scale: 0.95,
          filter: "blur(8px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay,
          },
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

interface SlideInProps extends BaseAnimationProps {
  direction?: 'left' | 'right';
  duration?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  className = '', 
  direction = 'left',
  delay = 0,
  duration = 0.8
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: direction === 'left' ? -100 : 100,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

interface ScaleInProps extends BaseAnimationProps {
  duration?: number;
  hoverScale?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.6,
  hoverScale = 1.05
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration,
        ease: [0.34, 1.56, 0.64, 1],
        delay,
      }}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// FLOATING ANIMATION
// ============================================================================

interface FloatingElementProps extends BaseAnimationProps {
  intensity?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className = '', 
  intensity = 1 
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -10 * intensity, 0],
        rotate: [0, 1 * intensity, 0],
      }}
      transition={{
        duration: 4 + intensity,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const PageTransitionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: {
          duration: 0.2,
          ease: 'easeOut',
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// ENHANCED ANIMATION (Flexible multi-type animation)
// ============================================================================

interface EnhancedAnimationProps extends BaseAnimationProps {
  type?: AnimationType;
  duration?: number;
}

export const EnhancedAnimation: React.FC<EnhancedAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  type = 'fadeIn',
}) => {
  const getInitialState = () => {
    switch (type) {
      case 'slideUp':
        return { opacity: 0, y: 30 };
      case 'slideLeft':
        return { opacity: 0, x: -30 };
      case 'slideRight':
        return { opacity: 0, x: 30 };
      case 'scaleIn':
        return { opacity: 0, scale: 0.8 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialState()}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// SIMPLE STAGGER (Auto-wraps children)
// ============================================================================

interface StaggerProps extends BaseAnimationProps {
  staggerDelay?: number;
}

export const Stagger: React.FC<StaggerProps> = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.08,
  className = "" 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Re-export AnimatePresence for convenience
export { AnimatePresence };
