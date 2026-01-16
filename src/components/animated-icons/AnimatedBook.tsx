import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBook = ({ className = "w-6 h-6 text-current" }: { className?: string }) => {
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
        <motion.path 
          d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
          variants={{
            hover: {
              x: 1,
              transition: { duration: 0.3 }
            }
          }}
        />
        <motion.path 
          d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
          variants={{
            hover: {
              x: -1,
              transition: { duration: 0.3 }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};
