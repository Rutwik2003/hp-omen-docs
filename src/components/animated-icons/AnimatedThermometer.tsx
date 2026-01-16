import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedThermometer = ({ className = "w-6 h-6 text-red-500" }: { className?: string }) => (
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
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    <motion.line 
        x1="12" y1="9" x2="12" y2="15" // Base position
        initial={{ y1: 15 }} // Start low
        animate={{ y1: 9 }} // Go high
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        strokeWidth="2"
        stroke="currentColor"
    />
  </svg>
);
