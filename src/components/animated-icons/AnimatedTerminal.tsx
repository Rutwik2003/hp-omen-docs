import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedTerminal = ({ className = "w-6 h-6 text-current" }: { className?: string }) => {
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
        <motion.polyline 
          points="4 17 10 11 4 5"
          variants={{
            hover: {
              x: 2,
              transition: { duration: 0.3 }
            }
          }}
        />
        <motion.line 
          x1="12" y1="19" x2="20" y2="19"
          variants={{
             hover: {
                opacity: [1, 0, 1],
                transition: {
                    duration: 1,
                    repeat: Infinity
                }
             }
          }}
        />
      </motion.svg>
    </div>
  );
};
