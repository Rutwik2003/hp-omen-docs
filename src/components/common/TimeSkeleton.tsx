import React from 'react';
import { motion } from 'framer-motion';

const TimeSkeleton = () => {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 rounded-full border-2 border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.15)]">
       {/* Ticks */}
       <div className="absolute inset-1 border border-dashed border-gray-700/50 rounded-full" />
       
       {/* Hands */}
       <motion.div 
            className="absolute w-0.5 h-6 bg-orange-500 origin-bottom"
            style={{ bottom: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
       />
       <motion.div 
            className="absolute w-0.5 h-4 bg-orange-300 origin-bottom"
            style={{ bottom: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
       />

       {/* Center Dot */}
       <div className="absolute w-2 h-2 bg-orange-400 rounded-full z-10" />

       {/* Orbiting Dot */}
       <motion.div 
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
       >
           <div className="w-1.5 h-1.5 bg-orange-400 rounded-full absolute top-1 left-1/2 -translate-x-1/2 shadow-[0_0_5px_#f97316]" />
       </motion.div>
    </div>
  );
};

export default TimeSkeleton;
