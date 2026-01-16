import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedSearch = ({ className = "w-6 h-6 text-current" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
        whileHover="hover"
      >
        <motion.circle 
          cx="11" 
          cy="11" 
          r="8"
          variants={{
            hover: {
              scale: 1.1,
              transition: { 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8 
              }
            }
          }}
        />
        <motion.path 
          d="m21 21-4.3-4.3"
          variants={{
            hover: {
              scale: 1.1,
              x: 1,
              y: 1,
              transition: { 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8
              }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};
