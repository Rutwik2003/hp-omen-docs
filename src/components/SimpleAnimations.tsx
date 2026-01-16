import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Stagger: React.FC<StaggerProps> = ({ 
  children, 
  delay = 0,
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
            staggerChildren: 0.08,
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
