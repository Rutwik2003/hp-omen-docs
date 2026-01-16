import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedGamepad = ({ className = "w-6 h-6 text-purple-400" }: { className?: string }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    whileHover={{ rotate: [0, -10, 10, 0] }}
    animate={{ y: [0, -2, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </motion.svg>
);
