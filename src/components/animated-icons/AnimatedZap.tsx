import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedZap = ({ className = "w-6 h-6 text-yellow-500" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <motion.polygon 
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" 
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);
