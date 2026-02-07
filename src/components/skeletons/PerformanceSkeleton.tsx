import { motion } from 'framer-motion';

const PerformanceSkeleton = () => {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
      {/* Background Arc */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          className="stroke-gray-700/50 fill-none"
          strokeWidth="4"
        />
        {/* Animated Speedometer Arc */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="40%"
          className="stroke-blue-500 fill-none"
          strokeWidth="4"
          strokeDasharray="251.2" // 2 * PI * r (approx)
          strokeDashoffset="251.2"
          strokeLinecap="round"
          animate={{ strokeDashoffset: ["251.2", "50", "100", "20"] }} // Fill up randomly
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
            className="text-lg font-bold text-white font-mono"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
        >
            <span className="text-blue-400">⚡</span>
        </motion.span>
      </div>

       {/* Blur Glow */}
       <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full z-[-1]" />
    </div>
  );
};

export default PerformanceSkeleton;
