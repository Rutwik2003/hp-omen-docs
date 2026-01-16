import React from 'react';
import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '', 
  delay = 0 
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
            delayChildren: delay,
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FadeInItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

const FadeInItem: React.FC<FadeInItemProps> = ({ 
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
            delay: delay,
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

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
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

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
  delay?: number;
}

const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  className = '', 
  direction = 'left',
  delay = 0 
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
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  className = '', 
  delay = 0 
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
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        delay: delay,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export {
  StaggerContainer,
  FadeInItem,
  FloatingElement,
  SlideIn,
  ScaleIn
};
