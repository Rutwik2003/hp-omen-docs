import React from 'react';
import { motion } from 'framer-motion';

const LinuxSkeleton = () => {
    const lines = [
        "sudo apt update",
        "Hit:1 http://security.ubuntu.com",
        "Get:2 http://hp-omen-repo/stable",
        "Fetching drivers...",
        "Done (1.2s)"
    ];

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-black p-4 border border-white/10 overflow-hidden relative font-mono text-xs">
      <div className="absolute top-0 left-0 w-full h-4 bg-[#1a1a1a] flex items-center px-2 space-x-1 border-b border-white/10">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
      
      <div className="mt-4 text-green-400 space-y-1">
        {lines.map((line, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.8, duration: 0.2 }}
            >
                <span className="text-gray-500 mr-2">$</span>
                {line}
            </motion.div>
        ))}
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-green-400 inline-block align-middle ml-1"
         />
      </div>
    </div>
  );
};

export default LinuxSkeleton;
