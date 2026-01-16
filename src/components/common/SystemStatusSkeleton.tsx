import React from 'react';
import { motion } from 'framer-motion';

const SystemStatusSkeleton = () => {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-800 rounded-lg border border-blue-400/30 p-2 flex flex-col justify-between overflow-hidden shadow-[0_0_15px_rgba(96,165,250,0.15)]">
       {/* Screen Header */}
       <div className="w-full h-1 bg-blue-500/50 rounded-full mb-1" />
       
       {/* Main Graph Area */}
       <div className="flex-1 flex items-end justify-between space-x-1">
            {[30, 60, 45, 80, 50].map((h, i) => (
                <motion.div 
                    key={i}
                    className="w-1.5 bg-blue-400 rounded-t-sm"
                    animate={{ height: [`${h}%`, `${h - 20}%`, `${h + 10}%`] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                />
            ))}
       </div>

       {/* Scan Line */}
       <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-[50%]"
            animate={{ top: ["-50%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
       />
    </div>
  );
};

export default SystemStatusSkeleton;
