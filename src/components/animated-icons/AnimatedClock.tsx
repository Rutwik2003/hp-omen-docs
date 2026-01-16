import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedClock = ({ className = "w-6 h-6 text-orange-400" }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <motion.line 
        x1="12" y1="12" x2="12" y2="6" 
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50%", originY: "50%" }}
    />
    <motion.line 
        x1="12" y1="12" x2="16" y2="12" 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50%", originY: "50%" }}
    />
  </svg>
);
