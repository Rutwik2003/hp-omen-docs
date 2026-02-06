import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ChecklistSkeleton = () => {
    const items = [1, 2, 3];

  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900/50 rounded-xl border border-green-500/30 flex items-center justify-center overflow-hidden">
      <div className="flex flex-col space-y-2 w-full max-w-[60%]">
        {items.map((i) => (
            <div key={i} className="flex items-center space-x-2">
                {/* Checkbox */}
                <div className="w-3 h-3 rounded-sm border border-green-500/50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.6, duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                    >
                        <Check className="w-2 h-2 text-green-400" strokeWidth={4} />
                    </motion.div>
                </div>
                {/* Line */}
                <motion.div 
                    className="h-1 bg-gray-700 rounded-full flex-1"
                    initial={{ width: "100%", backgroundColor: "#374151" }} // gray-700
                    animate={{ backgroundColor: ["#374151", "#4ade80", "#374151"] }} // flash green
                    transition={{ delay: i * 0.6, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                />
            </div>
        ))}
      </div>
      
       {/* Glow */}
       <div className="absolute inset-0 bg-green-500/10 blur-md z-[-1]" />
    </div>
  );
};

export default ChecklistSkeleton;
