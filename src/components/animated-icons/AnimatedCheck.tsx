import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedCheck = ({ className = "w-6 h-6 text-green-500" }: { className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" className="opacity-50" />
    <motion.path
      d="M22 4L12 14.01l-3-3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </svg>
);
