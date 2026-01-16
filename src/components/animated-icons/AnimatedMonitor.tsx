import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedMonitor = ({ className = "w-6 h-6 text-blue-400" }: { className?: string }) => (
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
    <motion.rect 
        x="2" 
        y="3" 
        width="20" 
        height="14" 
        rx="2" 
        ry="2" 
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: [0, 0.1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
    />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
