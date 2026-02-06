import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showMessage?: boolean;
  fullScreen?: boolean;
}

// Fun gaming-themed loading messages like in Omen Gaming Hub
const loadingMessages = [
  "Getting out of silver...",
  "Looking behind the waterfall...",
  "Downloading more RAM...",
  "Overclocking the flux capacitor...",
  "Warming up the RGB...",
  "Consulting the gaming gods...",
  "Loading epic moments...",
  "Buffing your stats...",
  "Rolling for initiative...",
  "Respawning in 3... 2... 1...",
  "Defragging the mainframe...",
  "Syncing with the matrix...",
  "Calibrating aim assist...",
  "Charging ultimate ability...",
  "Mining for diamonds...",
  "Feeding the hamster...",
  "Pressing F to pay respects...",
  "Speedrunning the loading...",
  "Waiting for teammates...",
  "Checking if the cake is a lie...",
];

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'white',
  showMessage = false,
  fullScreen = false
}) => {
  const [messageIndex, setMessageIndex] = useState(() => 
    Math.floor(Math.random() * loadingMessages.length)
  );

  // Rotate through messages
  useEffect(() => {
    if (!showMessage) return;
    
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [showMessage]);

  const sizeConfig = useMemo(() => ({
    sm: { diamond: 16, container: 'w-4 h-4' },
    md: { diamond: 24, container: 'w-6 h-6' },
    lg: { diamond: 48, container: 'w-12 h-12' },
    xl: { diamond: 80, container: 'w-20 h-20' }
  }), []);

  const diamondSize = sizeConfig[size].diamond;

  // Omen-style rotating diamond
  const Diamond = () => (
    <motion.div
      animate={{ 
        rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
        scale: [1, 1.05, 1, 0.95, 1, 1.05, 1, 0.95, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative"
      style={{ width: diamondSize, height: diamondSize }}
    >
      <svg
        width={diamondSize}
        height={diamondSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow/glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Diamond shape (rotated square) */}
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          rx="4"
          fill={color === 'white' ? '#FFFFFF' : 'currentColor'}
          transform="rotate(45 50 50)"
          filter="url(#glow)"
        />
      </svg>
    </motion.div>
  );

  // Full screen loading overlay
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        role="status"
        aria-label="Loading content"
        aria-live="polite"
      >
        {/* OMEN Gaming Hub logo area */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2L2 12L12 22L22 12L12 2Z" 
                fill="url(#omenGradient)"
              />
              <defs>
                <linearGradient id="omenGradient" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#FF6B35"/>
                  <stop offset="1" stopColor="#C41E3A"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-white text-lg font-semibold tracking-wide">OMEN Gaming Hub</span>
        </div>

        {/* Centered diamond */}
        <div className="mb-8">
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glowLarge" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect
                x="15"
                y="15"
                width="70"
                height="70"
                rx="4"
                fill="#FFFFFF"
                transform="rotate(45 50 50)"
                filter="url(#glowLarge)"
              />
            </svg>
          </motion.div>
        </div>

        {/* Loading message */}
        {showMessage && (
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white text-xl font-medium tracking-wide"
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        )}
      </div>
    );
  }

  // Inline spinner with optional message
  if (showMessage) {
    return (
      <div 
        className="flex flex-col items-center gap-4"
        role="status"
        aria-label="Loading"
        aria-live="polite"
      >
        <Diamond />
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/80 text-sm font-medium"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </div>
    );
  }

  // Simple inline diamond spinner
  return (
    <div role="status" aria-label="Loading">
      <Diamond />
    </div>
  );
};

export default LoadingSpinner;
