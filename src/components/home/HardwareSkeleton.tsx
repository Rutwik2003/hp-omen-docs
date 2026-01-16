import React from 'react';
import { motion } from 'framer-motion';

const HardwareSkeleton = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-950 p-4 border border-white/10 overflow-hidden relative flex items-center justify-center">
      {/* Circuit Board Trace Lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-30">
        <path d="M0 50 L 50 50 L 70 70" stroke="#f97316" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <path d="M100 0 L 100 30 L 70 50" stroke="#f97316" strokeWidth="1" fill="none" strokeDasharray="5,5" />
        <path d="M200 100 L 150 100 L 130 80" stroke="#f97316" strokeWidth="1" fill="none" strokeDasharray="5,5" />
      </svg>

      {/* Energy Particles flowing to center */}
      <motion.div 
        className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316]"
        animate={{ x: [0, 80], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }}
        style={{ y: "-50%" }}
      />
       <motion.div 
        className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316]"
        animate={{ x: [0, -80], opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeIn" }}
         style={{ y: "-50%" }}
      />

      {/* Central CPU Block */}
      <div className="relative z-10 w-20 h-20 bg-neutral-900 border border-orange-500/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)]">
        {/* Pulse inner glow */}
        <motion.div 
            className="absolute inset-0 bg-orange-500/20 rounded-lg"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Core Text */}
        <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 font-mono tracking-tighter">CORE_0</span>
            <div className="flex space-x-0.5 mt-1">
                 {[...Array(4)].map((_, i) => (
                    <motion.div 
                        key={i}
                        className="w-1.5 h-3 bg-orange-500 rounded-sm"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    />
                 ))}
            </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-orange-500" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-orange-500" />
      </div>
    </div>
  );
};

export default HardwareSkeleton;
