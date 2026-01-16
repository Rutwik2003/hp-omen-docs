import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedArrow = ({ className = "w-4 h-4 text-current" }: { className?: string }) => {
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
        <motion.path d="M5 12h14" 
           variants={{
            hover: {
              x: [0, 5, 0],
              transition: {
                 repeat: Infinity,
                 duration: 1.5
              }
            }
          }}
        />
        <motion.path d="m12 5 7 7-7 7" 
           variants={{
            hover: {
               x: [0, 5, 0],
               transition: {
                 repeat: Infinity,
                 duration: 1.5
              }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};
