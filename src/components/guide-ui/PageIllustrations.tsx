import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Shared types
type IllustrationProps = { className?: string; size?: 'sm' | 'md' | 'lg' };

// Consistent sizing for all illustrations
const sizeMap = {
  sm: { width: 80, height: 80, class: 'w-20 h-20' },
  md: { width: 120, height: 120, class: 'w-28 h-28' },
  lg: { width: 180, height: 180, class: 'w-44 h-44' }
};

// Shared hook for dynamic values
const useDynamicValue = (min: number, max: number, interval: number = 2000) => {
  const [value, setValue] = useState(Math.floor(Math.random() * (max - min + 1)) + min);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setValue(Math.floor(Math.random() * (max - min + 1)) + min);
    }, interval);
    return () => clearInterval(timer);
  }, [min, max, interval]);
  
  return value;
};

// Monitor/Display Illustration
export const MonitorIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const refreshRate = useDynamicValue(60, 165, 3000);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Monitor frame */}
      <rect x="6" y="6" width="52" height="36" rx="3" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1" strokeOpacity="0.5" />
      {/* Screen */}
      <rect x="9" y="9" width="46" height="30" rx="2" fill="#0a0a0a" />
      <motion.rect 
        x="9" y="9" width="46" height="30" rx="2" 
        fill="url(#screenGlow)" 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Content lines */}
      <rect x="13" y="14" width="20" height="2" rx="1" fill="#ff6b35" opacity="0.8" />
      <rect x="13" y="19" width="30" height="1.5" rx="1" fill="#3a3a3a" />
      <rect x="13" y="23" width="25" height="1.5" rx="1" fill="#2a2a2a" />
      {/* Stand */}
      <path d="M26 42 L38 42 L36 50 L28 50 Z" fill="#2a2a2a" />
      <ellipse cx="32" cy="52" rx="12" ry="3" fill="#1a1a1a" />
      {/* Refresh rate badge */}
      <motion.g key={refreshRate} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <rect x="38" y="28" width="14" height="8" rx="2" fill="#ff6b35" />
        <text x="45" y="34" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">{refreshRate}Hz</text>
      </motion.g>
      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0066ff" stopOpacity="0.05" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// GPU Illustration - Compact with animated fans
export const GPUIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const temp = useDynamicValue(45, 78, 2000);
  const fanSpeed = useDynamicValue(1200, 2400, 3000);
  
  const { class: sizeClass } = sizeMap[size];
  const tempColor = temp < 60 ? '#22c55e' : temp < 70 ? '#eab308' : '#ef4444';
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* GPU Body */}
      <rect x="4" y="14" width="56" height="36" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="4" y="14" width="56" height="6" rx="3" fill="url(#gpuAccent)" />
      
      {/* Fan 1 */}
      <circle cx="20" cy="34" r="12" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60000 / fanSpeed, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '20px 34px' }}
      >
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path key={i} d={`M20 34 L${20 + 9 * Math.cos(angle * Math.PI / 180)} ${34 + 9 * Math.sin(angle * Math.PI / 180)} A9 9 0 0 1 ${20 + 9 * Math.cos((angle + 50) * Math.PI / 180)} ${34 + 9 * Math.sin((angle + 50) * Math.PI / 180)} Z`} fill="#2a2a2a" />
        ))}
        <circle cx="20" cy="34" r="3" fill="#1a1a1a" />
      </motion.g>
      
      {/* Fan 2 */}
      <circle cx="44" cy="34" r="12" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 60000 / fanSpeed * 1.1, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '44px 34px' }}
      >
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path key={i} d={`M44 34 L${44 + 9 * Math.cos(angle * Math.PI / 180)} ${34 + 9 * Math.sin(angle * Math.PI / 180)} A9 9 0 0 1 ${44 + 9 * Math.cos((angle + 50) * Math.PI / 180)} ${34 + 9 * Math.sin((angle + 50) * Math.PI / 180)} Z`} fill="#2a2a2a" />
        ))}
        <circle cx="44" cy="34" r="3" fill="#1a1a1a" />
      </motion.g>
      
      {/* Temp indicator */}
      <motion.g key={temp} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <rect x="42" y="4" width="18" height="9" rx="2" fill={tempColor} />
        <text x="51" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">{temp}°C</text>
      </motion.g>
      
      {/* RGB strip */}
      <motion.rect x="4" y="47" width="56" height="3" rx="1" fill="url(#rgbAnim)" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      <defs>
        <linearGradient id="gpuAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#76b900" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#76b900" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="rgbAnim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" /><stop offset="25%" stopColor="#ff6b35" />
          <stop offset="50%" stopColor="#00ff00" /><stop offset="75%" stopColor="#0066ff" />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// CPU Illustration - Compact
export const CPUIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const usage = useDynamicValue(15, 95, 1500);
  const clock = useDynamicValue(3200, 5200, 2000);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* CPU Package */}
      <rect x="12" y="12" width="40" height="40" rx="3" fill="#1a472a" stroke="#c0a060" strokeWidth="1.5" />
      {/* IHS */}
      <rect x="16" y="16" width="32" height="32" rx="2" fill="#4a4a4a" />
      <rect x="19" y="19" width="26" height="26" fill="#3a3a3a" rx="1" />
      
      {/* Dynamic glow based on usage */}
      <motion.rect 
        x="19" y="19" width="26" height="26" rx="1"
        fill={`rgba(255, 107, 53, ${usage / 200})`}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Pins */}
      {[0,1,2,3,4].map(i => <rect key={`t${i}`} x={16 + i*7} y="6" width="3" height="6" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`b${i}`} x={16 + i*7} y="52" width="3" height="6" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`l${i}`} x="6" y={16 + i*7} width="6" height="3" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`r${i}`} x="52" y={16 + i*7} width="6" height="3" fill="#c0a060" rx="0.5" />)}
      
      {/* Clock speed */}
      <motion.g key={clock} initial={{ y: -2, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <text x="32" y="34" textAnchor="middle" fill="#888" fontSize="7" fontWeight="bold">{(clock/1000).toFixed(1)}</text>
        <text x="32" y="41" textAnchor="middle" fill="#666" fontSize="5">GHz</text>
      </motion.g>
    </motion.svg>
  );
};

// Thermal Illustration - Compact with animated fan
export const ThermalIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const temp = useDynamicValue(38, 75, 2000);
  const fanRpm = useDynamicValue(800, 3000, 2500);
  
  const { class: sizeClass } = sizeMap[size];
  const tempColor = temp < 50 ? '#22c55e' : temp < 65 ? '#eab308' : '#ef4444';
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Heatsink base */}
      <rect x="8" y="48" width="48" height="10" rx="2" fill="#3a3a3a" />
      {/* Heatsink fins */}
      {[0,1,2,3,4,5,6].map(i => (
        <motion.rect 
          key={i} x={11 + i*6} y="18" width="4" height="30" fill="#4a4a4a" rx="1"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}
      
      {/* Fan */}
      <circle cx="32" cy="32" r="16" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60000 / fanRpm, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '32px 32px' }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path key={i} d={`M32 32 L${32 + 12 * Math.cos(angle * Math.PI / 180)} ${32 + 12 * Math.sin(angle * Math.PI / 180)} A12 12 0 0 1 ${32 + 12 * Math.cos((angle + 30) * Math.PI / 180)} ${32 + 12 * Math.sin((angle + 30) * Math.PI / 180)} Z`} fill="#2a2a2a" />
        ))}
      </motion.g>
      <circle cx="32" cy="32" r="4" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1" />
      
      {/* Temp display */}
      <motion.g key={temp}>
        <rect x="42" y="4" width="18" height="10" rx="2" fill={tempColor} />
        <text x="51" y="12" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">{temp}°C</text>
      </motion.g>
    </motion.svg>
  );
};

// Storage Illustration - Compact SSD
export const StorageIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const speed = useDynamicValue(3500, 7200, 2000);
  const used = useDynamicValue(35, 85, 4000);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* SSD Body */}
      <rect x="6" y="16" width="52" height="32" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Label */}
      <rect x="10" y="20" width="28" height="18" rx="2" fill="#0a0a0a" />
      <rect x="12" y="23" width="14" height="3" rx="1" fill="#ff6b35" opacity="0.8" />
      <text x="13" y="33" fill="#888" fontSize="6" fontWeight="bold">1TB</text>
      <text x="13" y="39" fill="#555" fontSize="4">NVMe</text>
      
      {/* Storage bar */}
      <rect x="42" y="22" width="14" height="5" rx="1" fill="#2a2a2a" />
      <motion.rect 
        x="42" y="22" rx="1"
        width={14 * used / 100} height="5" 
        fill={used > 80 ? '#ef4444' : used > 60 ? '#eab308' : '#22c55e'}
        key={used}
        initial={{ width: 0 }}
        animate={{ width: 14 * used / 100 }}
        transition={{ duration: 0.5 }}
      />
      <text x="49" y="34" textAnchor="middle" fill="#888" fontSize="4">{used}%</text>
      
      {/* Speed badge */}
      <motion.g key={speed}>
        <rect x="40" y="4" width="20" height="10" rx="2" fill="#3b82f6" />
        <text x="50" y="11" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">{speed}</text>
      </motion.g>
      
      {/* Activity LED */}
      <motion.circle cx="54" cy="36" r="2" fill="#22c55e" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />
      
      {/* M.2 connector */}
      <rect x="54" y="30" width="4" height="10" fill="#c0a060" rx="1" />
    </motion.svg>
  );
};

// Security Illustration - Shield
export const SecurityIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const [secure, setSecure] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => setSecure(s => !s || Math.random() > 0.2), 3000);
    return () => clearInterval(timer);
  }, []);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Shield */}
      <motion.path 
        d="M32 6 L54 14 L54 32 Q54 50 32 58 Q10 50 10 32 L10 14 Z"
        fill="url(#shieldFill)"
        stroke={secure ? '#22c55e' : '#eab308'}
        strokeWidth="1.5"
        animate={{ scale: secure ? 1 : [1, 1.02, 1] }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Inner shield */}
      <path d="M32 12 L48 18 L48 32 Q48 46 32 52 Q16 46 16 32 L16 18 Z" fill="#0a0a0a" opacity="0.8" />
      
      {/* Check or scanning */}
      {secure ? (
        <motion.path 
          d="M22 32 L28 38 L42 24"
          stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
        />
      ) : (
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
          <rect x="24" y="28" width="16" height="2" rx="1" fill="#eab308" />
          <rect x="24" y="33" width="16" height="2" rx="1" fill="#eab308" />
          <rect x="24" y="38" width="16" height="2" rx="1" fill="#eab308" />
        </motion.g>
      )}
      
      <defs>
        <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={secure ? '#22c55e' : '#eab308'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={secure ? '#16a34a' : '#ca8a04'} stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Gaming Illustration - Controller (square aspect ratio)
export const GamingIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const [activeButton, setActiveButton] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setActiveButton(b => (b + 1) % 4), 500);
    return () => clearInterval(timer);
  }, []);
  
  const { class: sizeClass } = sizeMap[size];
  const buttonColors = ['#22c55e', '#ef4444', '#3b82f6', '#eab308'];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Controller body */}
      <path d="M14 22 Q6 22 5 32 Q4 46 14 48 L22 48 Q28 45 30 42 L34 42 Q36 45 42 48 L50 48 Q60 46 59 32 Q58 22 50 22 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Grips */}
      <ellipse cx="12" cy="40" rx="5" ry="8" fill="#0a0a0a" />
      <ellipse cx="52" cy="40" rx="5" ry="8" fill="#0a0a0a" />
      
      {/* D-Pad */}
      <rect x="17" y="28" width="4" height="10" rx="1" fill="#2a2a2a" />
      <rect x="14" y="31" width="10" height="4" rx="1" fill="#2a2a2a" />
      
      {/* Face buttons */}
      {[0, 1, 2, 3].map((i) => {
        const positions = [{x: 46, y: 28}, {x: 50, y: 32}, {x: 42, y: 32}, {x: 46, y: 36}];
        return (
          <motion.circle 
            key={i} cx={positions[i].x} cy={positions[i].y} r="3"
            fill={buttonColors[i]}
            animate={{ opacity: activeButton === i ? 1 : 0.4, scale: activeButton === i ? 1.15 : 1 }}
            transition={{ duration: 0.15 }}
          />
        );
      })}
      
      {/* Analog sticks */}
      <circle cx="26" cy="38" r="5" fill="#2a2a2a" stroke="#3a3a3a" />
      <motion.circle cx="26" cy="38" r="3" fill="#1a1a1a" animate={{ x: [-0.5, 0.5, -0.5], y: [-0.5, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      <circle cx="38" cy="38" r="5" fill="#2a2a2a" stroke="#3a3a3a" />
      <motion.circle cx="38" cy="38" r="3" fill="#1a1a1a" animate={{ x: [0.5, -0.5, 0], y: [0, 0.5, -0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
      
      {/* Center OMEN button */}
      <motion.circle cx="32" cy="30" r="4" fill="url(#omenBtnGaming)" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      <defs>
        <radialGradient id="omenBtnGaming" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#ff4500" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// Laptop Illustration
export const LaptopIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Screen */}
      <rect x="8" y="6" width="48" height="32" rx="2" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="0.8" strokeOpacity="0.4" />
      <rect x="11" y="9" width="42" height="26" rx="1" fill="#0a0a0a" />
      
      {/* Screen content */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x="14" y="13" width="16" height="2" rx="1" fill="#ff6b35" opacity="0.8" />
        <rect x="14" y="18" width="24" height="1.5" rx="1" fill="#3a3a3a" />
        <rect x="14" y="22" width="18" height="1.5" rx="1" fill="#2a2a2a" />
        <rect x="40" y="12" width="10" height="6" rx="1" fill="url(#omenLogoLaptop)" />
      </motion.g>
      
      {/* Webcam */}
      <circle cx="32" cy="7.5" r="1" fill="#2a2a2a" />
      
      {/* Base */}
      <path d="M4 38 L8 38 Q8 37 10 37 L54 37 Q56 37 56 38 L60 38 L58 52 Q57 54 54 54 L10 54 Q7 54 6 52 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.5" />
      
      {/* Keyboard hint */}
      <g opacity="0.5">
        {[0,1,2,3,4,5].map(i => <rect key={`k${i}`} x={14 + i*6} y="42" width="4" height="3" rx="0.5" fill="#2a2a2a" />)}
      </g>
      
      {/* RGB strip */}
      <motion.rect x="10" y="37" width="44" height="1.5" rx="0.5" fill="url(#rgbStripLaptop)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      
      <defs>
        <linearGradient id="omenLogoLaptop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff4500" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="rgbStripLaptop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" /><stop offset="33%" stopColor="#00ff00" />
          <stop offset="66%" stopColor="#0066ff" /><stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Driver Illustration
export const DriverIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setDownloading(d => !d), 4000);
    return () => clearInterval(timer);
  }, []);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Disc */}
      <circle cx="32" cy="32" r="26" fill="url(#discBgDriver)" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="5" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Shine */}
      <motion.path d="M20 18 Q32 12 44 20 Q35 16 22 24 Z" fill="white" opacity="0.1" animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 3, repeat: Infinity }} />
      
      {/* Label */}
      <circle cx="32" cy="32" r="10" fill="#1a1a1a" />
      <text x="32" y="31" textAnchor="middle" fill="#ff6b35" fontSize="5" fontWeight="bold">DRIVER</text>
      <text x="32" y="37" textAnchor="middle" fill="#666" fontSize="4">v2.1</text>
      
      {/* Download indicator */}
      {downloading && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <rect x="42" y="46" width="16" height="12" rx="2" fill="#22c55e" />
          <motion.path d="M50 49 L50 54 M47 52 L50 55 L53 52" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" animate={{ y: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
        </motion.g>
      )}
      
      <defs>
        <linearGradient id="discBgDriver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" /><stop offset="50%" stopColor="#2a2a2a" /><stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Performance Illustration - Dynamic speedometer
export const PerformanceIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const fps = useDynamicValue(60, 240, 1000);
  const needleAngle = ((fps - 30) / 240) * 180 - 90;
  
  const { class: sizeClass } = sizeMap[size];
  const fpsColor = fps < 60 ? '#ef4444' : fps < 100 ? '#eab308' : '#22c55e';
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Gauge background */}
      <path d="M10 44 A22 22 0 1 1 54 44" fill="none" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round" />
      
      {/* Colored segments */}
      <path d="M10 44 A22 22 0 0 1 18 25" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
      <path d="M18 25 A22 22 0 0 1 46 25" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
      <path d="M46 25 A22 22 0 0 1 54 44" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
      
      {/* Needle */}
      <motion.g
        animate={{ rotate: needleAngle }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ transformOrigin: '32px 44px' }}
      >
        <line x1="32" y1="44" x2="32" y2="22" stroke="url(#needleGradPerf)" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      
      {/* Center hub */}
      <circle cx="32" cy="44" r="4" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" />
      
      {/* FPS display */}
      <motion.g key={fps}>
        <rect x="18" y="50" width="28" height="10" rx="2" fill={fpsColor} />
        <text x="32" y="58" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">{fps} FPS</text>
      </motion.g>
      
      <defs>
        <linearGradient id="needleGradPerf" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#ff4500" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Audio/Speaker Illustration
export const AudioIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const volume = useDynamicValue(40, 100, 2000);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Speaker body */}
      <path d="M14 24 L22 24 L34 14 L34 50 L22 40 L14 40 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Sound waves */}
      {[0, 1, 2].map(i => (
        <motion.path
          key={i}
          d={`M40 ${24 + i * 3} Q${48 + i * 5} 32 40 ${40 - i * 3}`}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: volume > 30 + i * 25 ? [0.3, 1, 0.3] : 0.1, scale: [0.95, 1, 0.95] }}
          transition={{ duration: 0.5 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      
      {/* Volume bar */}
      <rect x="16" y="52" width="32" height="4" rx="1" fill="#2a2a2a" />
      <motion.rect x="16" y="52" width={32 * volume / 100} height="4" rx="1" fill="#ff6b35" key={volume} initial={{ width: 0 }} animate={{ width: 32 * volume / 100 }} />
      
      {/* B&O badge */}
      <rect x="42" y="16" width="16" height="10" rx="2" fill="#1a1a1a" stroke="#c0a060" strokeWidth="0.8" />
      <text x="50" y="23" textAnchor="middle" fill="#c0a060" fontSize="5" fontWeight="bold">B&O</text>
    </motion.svg>
  );
};

// ============= NEW DIVERSE ILLUSTRATIONS =============

// Backup/Cloud Illustration - Cloud with data sync
export const BackupIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const progress = useDynamicValue(15, 95, 3000);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Cloud shape */}
      <path d="M48 28 Q58 28 58 38 Q58 48 48 48 L18 48 Q8 48 8 38 Q8 32 14 30 Q14 20 26 20 Q36 20 40 26 Q44 24 48 28 Z" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1.5" />
      
      {/* Upload arrow */}
      <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <path d="M32 24 L32 40" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 30 L32 24 L38 30" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
      
      {/* Progress bar */}
      <rect x="14" y="52" width="36" height="5" rx="2" fill="#2a2a2a" />
      <motion.rect 
        x="14" y="52" rx="2"
        width={36 * progress / 100} height="5" 
        fill="#3b82f6"
        key={progress}
        initial={{ width: 0 }}
        animate={{ width: 36 * progress / 100 }}
      />
      <text x="32" y="62" textAnchor="middle" fill="#888" fontSize="4">{progress}%</text>
    </motion.svg>
  );
};

// Windows OS Illustration
export const WindowsIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Windows logo */}
      <motion.g initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
        <rect x="10" y="10" width="20" height="20" rx="2" fill="#0078d4" />
        <rect x="34" y="10" width="20" height="20" rx="2" fill="#0078d4" />
        <rect x="10" y="34" width="20" height="20" rx="2" fill="#0078d4" />
        <rect x="34" y="34" width="20" height="20" rx="2" fill="#0078d4" />
      </motion.g>
      
      {/* Glow */}
      <motion.rect x="10" y="10" width="44" height="44" rx="4" fill="url(#winGlow)" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      
      <defs>
        <radialGradient id="winGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0078d4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0078d4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// Network/WiFi Illustration
export const NetworkIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const signal = useDynamicValue(1, 4, 3000);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* WiFi waves */}
      {[0, 1, 2, 3].map(i => (
        <motion.path
          key={i}
          d={`M${16 + i * 4} ${44 - i * 8} Q32 ${28 - i * 8} ${48 - i * 4} ${44 - i * 8}`}
          fill="none"
          stroke={signal > i ? '#22c55e' : '#3a3a3a'}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: signal > i ? 1 : 0.3 }}
        />
      ))}
      
      {/* Center dot */}
      <motion.circle cx="32" cy="48" r="4" fill="#22c55e" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      
      {/* Speed indicator */}
      <rect x="20" y="54" width="24" height="6" rx="2" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.5" />
      <text x="32" y="59" textAnchor="middle" fill="#888" fontSize="4">{signal * 150} Mbps</text>
    </motion.svg>
  );
};

// Battery/Power Illustration
export const BatteryIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const level = useDynamicValue(20, 95, 4000);
  const { class: sizeClass } = sizeMap[size];
  const color = level < 20 ? '#ef4444' : level < 50 ? '#eab308' : '#22c55e';
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Battery body */}
      <rect x="8" y="18" width="44" height="28" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1.5" />
      {/* Battery tip */}
      <rect x="52" y="26" width="6" height="12" rx="2" fill="#3a3a3a" />
      
      {/* Battery level */}
      <motion.rect 
        x="12" y="22" rx="2"
        width={36 * level / 100} height="20" 
        fill={color}
        key={level}
        initial={{ width: 0 }}
        animate={{ width: 36 * level / 100 }}
      />
      
      {/* Percentage */}
      <text x="30" y="36" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{level}%</text>
      
      {/* Charging indicator */}
      <motion.path d="M26 52 L30 56 L28 58 L34 64 L30 60 L32 58 L26 52 Z" fill="#eab308" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.svg>
  );
};

// BIOS/Firmware Illustration
export const BiosIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Chip body */}
      <rect x="14" y="14" width="36" height="36" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Pins */}
      {[0,1,2,3,4].map(i => <rect key={`t${i}`} x={18 + i*6} y="8" width="3" height="6" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`b${i}`} x={18 + i*6} y="50" width="3" height="6" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`l${i}`} x="8" y={18 + i*6} width="6" height="3" fill="#c0a060" rx="0.5" />)}
      {[0,1,2,3,4].map(i => <rect key={`r${i}`} x="50" y={18 + i*6} width="6" height="3" fill="#c0a060" rx="0.5" />)}
      
      {/* BIOS text */}
      <motion.text x="32" y="30" textAnchor="middle" fill="#ff6b35" fontSize="7" fontWeight="bold" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>BIOS</motion.text>
      <text x="32" y="40" textAnchor="middle" fill="#666" fontSize="5">v1.12</text>
      
      {/* Status LED */}
      <motion.circle cx="44" cy="20" r="2" fill="#22c55e" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.svg>
  );
};

// RAM/Memory Illustration
export const RamIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const usage = useDynamicValue(30, 85, 2000);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* RAM stick body */}
      <rect x="4" y="20" width="56" height="24" rx="2" fill="#1a472a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Memory chips */}
      {[0,1,2,3,4,5,6].map(i => (
        <motion.rect 
          key={i} x={8 + i*7} y="24" width="5" height="16" rx="1" 
          fill={usage > (i+1) * 12 ? '#22c55e' : '#0a0a0a'}
          animate={{ opacity: usage > (i+1) * 12 ? [0.7, 1, 0.7] : 0.3 }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      
      {/* Notch */}
      <rect x="28" y="44" width="8" height="4" fill="#0a0a0a" />
      
      {/* Pins */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => <rect key={`p${i}`} x={6 + i*4} y="44" width="2" height="6" fill="#c0a060" />)}
      
      {/* Usage */}
      <rect x="4" y="54" width="56" height="6" rx="2" fill="#2a2a2a" />
      <motion.rect x="4" y="54" width={56 * usage / 100} height="6" rx="2" fill="#22c55e" key={usage} />
      <text x="32" y="64" textAnchor="middle" fill="#888" fontSize="4">{usage}% • 32GB</text>
    </motion.svg>
  );
};

// Keyboard Illustration
export const KeyboardIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const [activeKey, setActiveKey] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setActiveKey(k => (k + 1) % 6), 300);
    return () => clearInterval(timer);
  }, []);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Keyboard body */}
      <rect x="4" y="18" width="56" height="32" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Keys row 1 */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <motion.rect 
          key={`r1${i}`} x={8 + i*5.5} y="22" width="4" height="4" rx="0.5" 
          fill={activeKey === i % 6 ? '#ff6b35' : '#2a2a2a'}
          animate={{ scale: activeKey === i % 6 ? 0.9 : 1 }}
        />
      ))}
      {/* Keys row 2 */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={`r2${i}`} x={8 + i*5.5} y="28" width="4" height="4" rx="0.5" fill="#2a2a2a" />
      ))}
      {/* Keys row 3 */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={`r3${i}`} x={8 + i*5.5} y="34" width="4" height="4" rx="0.5" fill="#2a2a2a" />
      ))}
      {/* Space bar */}
      <rect x="18" y="40" width="28" height="4" rx="1" fill="#2a2a2a" />
      
      {/* RGB underglow */}
      <motion.rect x="4" y="48" width="56" height="2" rx="1" fill="url(#kbRgb)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      <defs>
        <linearGradient id="kbRgb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" /><stop offset="33%" stopColor="#00ff00" />
          <stop offset="66%" stopColor="#0066ff" /><stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Update/Download Illustration
export const UpdateIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const progress = useDynamicValue(10, 90, 2000);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Circular progress */}
      <circle cx="32" cy="28" r="20" fill="none" stroke="#2a2a2a" strokeWidth="4" />
      <motion.circle 
        cx="32" cy="28" r="20" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="4" 
        strokeLinecap="round"
        strokeDasharray={125.6}
        strokeDashoffset={125.6 * (1 - progress / 100)}
        key={progress}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 28px' }}
      />
      
      {/* Download arrow */}
      <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 1, repeat: Infinity }}>
        <path d="M32 18 L32 34" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 28 L32 34 L38 28" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
      
      {/* Percentage text */}
      <text x="32" y="56" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{progress}%</text>
      <text x="32" y="62" textAnchor="middle" fill="#888" fontSize="4">Updating...</text>
    </motion.svg>
  );
};

// Settings/Gear Illustration
export const SettingsIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '32px 32px' }}
      >
        {/* Gear teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <rect 
            key={i} 
            x="29" y="6" width="6" height="10" rx="1" 
            fill="#3a3a3a"
            transform={`rotate(${angle} 32 32)`}
          />
        ))}
        {/* Gear body */}
        <circle cx="32" cy="32" r="16" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
        <circle cx="32" cy="32" r="8" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" />
      </motion.g>
      
      {/* Center dot */}
      <circle cx="32" cy="32" r="3" fill="#ff6b35" />
    </motion.svg>
  );
};

// Folder/Files Illustration
export const FolderIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Folder back */}
      <path d="M6 18 L6 52 Q6 54 8 54 L56 54 Q58 54 58 52 L58 22 Q58 20 56 20 L28 20 L24 14 Q23 12 21 12 L8 12 Q6 12 6 14 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      
      {/* Folder tab */}
      <path d="M6 18 L24 18 L28 20 L6 20 Z" fill="#2a2a2a" />
      
      {/* Files inside */}
      <motion.rect x="14" y="28" width="16" height="18" rx="1" fill="#ff6b35" opacity="0.8" initial={{ y: 32 }} animate={{ y: 28 }} transition={{ delay: 0.2 }} />
      <motion.rect x="24" y="30" width="16" height="18" rx="1" fill="#3b82f6" opacity="0.8" initial={{ y: 34 }} animate={{ y: 30 }} transition={{ delay: 0.3 }} />
      <motion.rect x="34" y="32" width="16" height="18" rx="1" fill="#22c55e" opacity="0.8" initial={{ y: 36 }} animate={{ y: 32 }} transition={{ delay: 0.4 }} />
      
      {/* File count */}
      <circle cx="52" cy="16" r="8" fill="#ff6b35" />
      <text x="52" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">3</text>
    </motion.svg>
  );
};

// Guide Book Illustration (for quickstart/guides) - Tech/Gaming themed digital guide
export const GuideBookIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const progress = useDynamicValue(1, 6, 2000);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Tablet/Device frame */}
      <rect x="8" y="4" width="48" height="56" rx="4" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" strokeOpacity="0.6" />
      
      {/* Screen */}
      <rect x="11" y="8" width="42" height="48" rx="2" fill="#0a0a0a" />
      
      {/* Screen glow effect */}
      <motion.rect 
        x="11" y="8" width="42" height="48" rx="2" 
        fill="url(#guideScreenGlow)" 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Header bar with OMEN accent */}
      <rect x="11" y="8" width="42" height="8" rx="2" fill="#ff6b35" opacity="0.15" />
      <motion.rect x="13" y="10" width="8" height="4" rx="1" fill="#ff6b35" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <rect x="24" y="11" width="20" height="2" rx="1" fill="#ff6b35" opacity="0.5" />
      
      {/* Step indicators - shows progress */}
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle 
            key={i}
            cx={16 + i * 6} 
            cy="22" 
            r="2" 
            fill={i < progress ? '#ff6b35' : '#2a2a2a'}
            animate={i < progress ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </g>
      
      {/* Content lines - animated typing effect */}
      <motion.rect x="14" y="28" width="28" height="2" rx="1" fill="#3a3a3a" animate={{ width: [20, 28, 20] }} transition={{ duration: 3, repeat: Infinity }} />
      <rect x="14" y="34" width="34" height="1.5" rx="1" fill="#2a2a2a" />
      <rect x="14" y="39" width="30" height="1.5" rx="1" fill="#2a2a2a" />
      <rect x="14" y="44" width="26" height="1.5" rx="1" fill="#2a2a2a" />
      
      {/* Action button */}
      <motion.rect 
        x="14" y="50" width="18" height="4" rx="2" 
        fill="#ff6b35"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Decorative corner accents */}
      <path d="M11 12 L11 8 L15 8" fill="none" stroke="#ff6b35" strokeWidth="1" opacity="0.5" />
      <path d="M53 12 L53 8 L49 8" fill="none" stroke="#ff6b35" strokeWidth="1" opacity="0.5" />
      <path d="M11 52 L11 56 L15 56" fill="none" stroke="#ff6b35" strokeWidth="1" opacity="0.5" />
      <path d="M53 52 L53 56 L49 56" fill="none" stroke="#ff6b35" strokeWidth="1" opacity="0.5" />
      
      {/* Status indicator */}
      <motion.circle 
        cx="50" cy="12" r="2" 
        fill="#22c55e"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      <defs>
        <radialGradient id="guideScreenGlow" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// Tools/Wrench Illustration
export const ToolsIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Wrench */}
      <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M14 14 L10 18 Q8 20 10 22 L18 30 L34 14 L26 6 Q24 4 22 6 L18 10 L14 14 Z" fill="#4a4a4a" stroke="#666" strokeWidth="1" />
        <path d="M18 30 L34 46 Q36 48 38 46 L50 34 Q52 32 50 30 L34 14 L18 30 Z" fill="#3a3a3a" />
      </motion.g>
      
      {/* Screwdriver */}
      <motion.g animate={{ rotate: [5, -5, 5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ transformOrigin: '42px 32px' }}>
        <rect x="38" y="24" width="8" height="32" rx="1" fill="#ff6b35" />
        <rect x="36" y="24" width="12" height="8" rx="1" fill="#2a2a2a" />
        <path d="M40 56 L42 62 L44 56 Z" fill="#888" />
      </motion.g>
    </motion.svg>
  );
};

// Power/Shutdown Illustration
export const PowerIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Power circle */}
      <motion.circle 
        cx="32" cy="34" r="22" 
        fill="none" 
        stroke="#ef4444" 
        strokeWidth="3"
        strokeDasharray="110 28"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Power line */}
      <motion.line x1="32" y1="12" x2="32" y2="34" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      
      {/* Glow */}
      <motion.circle cx="32" cy="34" r="16" fill="url(#powerGlow)" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      <defs>
        <radialGradient id="powerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// ============= STEP-SPECIFIC ILLUSTRATIONS =============
// These are COMPLETELY DIFFERENT from header illustrations
// Used only in step sections to ensure no repetition

// Step: Lightbulb (for tips/ideas)
export const StepLightbulbIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M32 8 Q44 8 48 20 Q52 32 42 42 L42 48 L22 48 L22 42 Q12 32 16 20 Q20 8 32 8 Z" fill="#1a1a1a" stroke="#eab308" strokeWidth="1.5" animate={{ filter: ['drop-shadow(0 0 4px #eab308)', 'drop-shadow(0 0 8px #eab308)', 'drop-shadow(0 0 4px #eab308)'] }} transition={{ duration: 2, repeat: Infinity }} />
      <rect x="24" y="48" width="16" height="4" rx="1" fill="#3a3a3a" />
      <rect x="26" y="52" width="12" height="3" rx="1" fill="#3a3a3a" />
      <motion.path d="M28 22 L28 34 M36 22 L36 34 M28 28 L36 28" stroke="#eab308" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Checkbox/Checklist
export const StepChecklistIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="8" y="8" width="48" height="48" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="14" y={16 + i * 14} width="10" height="10" rx="2" fill="#0a0a0a" stroke={i < 2 ? '#22c55e' : '#3a3a3a'} strokeWidth="1" />
          {i < 2 && <motion.path d={`M16 ${21 + i * 14} L19 ${24 + i * 14} L24 ${18 + i * 14}`} stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.3 }} />}
          <rect x="28" y={18 + i * 14} width={i === 2 ? 20 : 24} height="3" rx="1" fill={i < 2 ? '#4a4a4a' : '#2a2a2a'} />
        </g>
      ))}
    </motion.svg>
  );
};

// Step: Rocket (for boost/performance)
export const StepRocketIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M32 6 Q42 14 44 28 L44 38 L36 46 L28 46 L20 38 L20 28 Q22 14 32 6 Z" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" />
        <circle cx="32" cy="24" r="6" fill="#0a0a0a" stroke="#ff6b35" strokeWidth="1" />
        <path d="M18 30 Q14 34 16 42 L20 38 Z" fill="#3a3a3a" />
        <path d="M46 30 Q50 34 48 42 L44 38 Z" fill="#3a3a3a" />
      </motion.g>
      <motion.g animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1.2, 0.8] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ transformOrigin: '32px 50px' }}>
        <path d="M28 46 L32 58 L36 46 Z" fill="#ff6b35" />
        <path d="M30 46 L32 54 L34 46 Z" fill="#eab308" />
      </motion.g>
    </motion.svg>
  );
};

// Step: Target/Bullseye (for goals/accuracy)
export const StepTargetIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#ef4444" strokeWidth="4" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.6" />
      <circle cx="32" cy="32" r="10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" />
      <motion.circle cx="32" cy="32" r="4" fill="#ef4444" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      <motion.path d="M50 14 L38 26 M50 14 L50 22 M50 14 L42 14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
    </motion.svg>
  );
};

// Step: Clock/Timer
export const StepTimerIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx="32" cy="34" r="24" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="2" />
      <rect x="30" y="6" width="4" height="8" rx="1" fill="#3a3a3a" />
      <motion.line x1="32" y1="34" x2="32" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '32px 34px' }} />
      <motion.line x1="32" y1="34" x2="42" y2="34" stroke="#fff" strokeWidth="2" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '32px 34px' }} />
      <circle cx="32" cy="34" r="3" fill="#3b82f6" />
    </motion.svg>
  );
};

// Step: Download Arrow
export const StepDownloadIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="12" y="44" width="40" height="12" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <motion.g animate={{ y: [-3, 3, -3] }} transition={{ duration: 1, repeat: Infinity }}>
        <rect x="26" y="8" width="12" height="28" rx="2" fill="#22c55e" />
        <path d="M22 32 L32 44 L42 32 Z" fill="#22c55e" />
      </motion.g>
      <motion.circle cx="48" cy="50" r="3" fill="#22c55e" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Lock/Security
export const StepLockIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="14" y="28" width="36" height="28" rx="4" fill="#1a1a1a" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M20 28 L20 20 Q20 8 32 8 Q44 8 44 20 L44 28" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <motion.circle cx="32" cy="42" r="5" fill="#22c55e" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <rect x="30" y="46" width="4" height="6" rx="1" fill="#22c55e" />
    </motion.svg>
  );
};

// Step: Sliders/Adjustment
export const StepSlidersIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const val1 = useDynamicValue(20, 80, 2000);
  const val2 = useDynamicValue(30, 70, 2500);
  const val3 = useDynamicValue(40, 90, 3000);
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[{ y: 16, val: val1, color: '#ff6b35' }, { y: 30, val: val2, color: '#3b82f6' }, { y: 44, val: val3, color: '#22c55e' }].map((s, i) => (
        <g key={i}>
          <rect x="10" y={s.y} width="44" height="4" rx="2" fill="#2a2a2a" />
          <motion.rect x="10" y={s.y} width={44 * s.val / 100} height="4" rx="2" fill={s.color} key={s.val} />
          <motion.circle cx={10 + 44 * s.val / 100} cy={s.y + 2} r="6" fill={s.color} stroke="#fff" strokeWidth="1" key={`c${s.val}`} />
        </g>
      ))}
    </motion.svg>
  );
};

// Step: Terminal/Command
export const StepTerminalIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="6" y="10" width="52" height="44" rx="4" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="6" y="10" width="52" height="8" rx="4" fill="#1a1a1a" />
      <circle cx="12" cy="14" r="2" fill="#ef4444" />
      <circle cx="18" cy="14" r="2" fill="#eab308" />
      <circle cx="24" cy="14" r="2" fill="#22c55e" />
      <motion.g animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
        <text x="12" y="32" fill="#22c55e" fontSize="8" fontFamily="monospace">$ _</text>
      </motion.g>
      <text x="12" y="44" fill="#888" fontSize="6" fontFamily="monospace">running...</text>
    </motion.svg>
  );
};

// Step: Wrench (simple, different from Tools)
export const StepWrenchIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.g animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: '32px 32px' }}>
        <path d="M20 12 Q14 14 12 20 Q10 26 14 30 L34 50 Q38 54 42 50 L50 42 Q54 38 50 34 L30 14 Q26 10 20 12 Z" fill="#4a4a4a" stroke="#888" strokeWidth="1" />
        <path d="M14 18 L20 24 L24 20 L18 14 Q16 12 14 14 Q12 16 14 18 Z" fill="#888" />
      </motion.g>
    </motion.svg>
  );
};

// Step: Plug/Connection
export const StepPlugIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="24" y="6" width="6" height="16" rx="1" fill="#c0a060" />
      <rect x="34" y="6" width="6" height="16" rx="1" fill="#c0a060" />
      <rect x="18" y="22" width="28" height="20" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <motion.rect x="28" y="42" width="8" height="16" rx="2" fill="#3a3a3a" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="32" cy="32" r="4" fill="#22c55e" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Eye/Visibility
export const StepEyeIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M4 32 Q16 12 32 12 Q48 12 60 32 Q48 52 32 52 Q16 52 4 32 Z" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="12" fill="#0a0a0a" stroke="#3b82f6" strokeWidth="1" />
      <motion.circle cx="32" cy="32" r="6" fill="#3b82f6" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <circle cx="36" cy="28" r="2" fill="#fff" opacity="0.8" />
    </motion.svg>
  );
};

// Step: Zap/Lightning
export const StepZapIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M36 4 L18 32 L28 32 L24 60 L46 28 L34 28 L40 4 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" animate={{ filter: ['drop-shadow(0 0 4px #eab308)', 'drop-shadow(0 0 10px #eab308)', 'drop-shadow(0 0 4px #eab308)'] }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Chip/PCB
export const StepChipIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="16" y="16" width="32" height="32" rx="2" fill="#1a472a" stroke="#22c55e" strokeWidth="1" />
      {[0,1,2,3].map(i => <rect key={`t${i}`} x={22 + i*6} y="10" width="3" height="6" fill="#c0a060" />)}
      {[0,1,2,3].map(i => <rect key={`b${i}`} x={22 + i*6} y="48" width="3" height="6" fill="#c0a060" />)}
      {[0,1,2,3].map(i => <rect key={`l${i}`} x="10" y={22 + i*6} width="6" height="3" fill="#c0a060" />)}
      {[0,1,2,3].map(i => <rect key={`r${i}`} x="48" y={22 + i*6} width="6" height="3" fill="#c0a060" />)}
      <motion.rect x="24" y="24" width="16" height="16" rx="1" fill="#22c55e" opacity="0.3" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Layers/Stack
export const StepLayersIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M32 8 L56 20 L32 32 L8 20 Z" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M8 28 L32 40 L56 28" fill="none" stroke="#3b82f6" strokeWidth="2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 0.7 }} transition={{ delay: 0.3 }} />
      <motion.path d="M8 36 L32 48 L56 36" fill="none" stroke="#3b82f6" strokeWidth="2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 0.5 }} transition={{ delay: 0.4 }} />
      <motion.path d="M8 44 L32 56 L56 44" fill="none" stroke="#3b82f6" strokeWidth="2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 0.3 }} transition={{ delay: 0.5 }} />
    </motion.svg>
  );
};

// Step: Gauge/Meter
export const StepGaugeIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const val = useDynamicValue(20, 80, 2000);
  const { class: sizeClass } = sizeMap[size];
  const angle = -135 + (val / 100) * 270;
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M8 44 A24 24 0 1 1 56 44" fill="none" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 44 A24 24 0 0 1 16 24" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
      <path d="M16 24 A24 24 0 0 1 48 24" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 24 A24 24 0 0 1 56 44" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
      <motion.line x1="32" y1="40" x2="32" y2="20" stroke="#fff" strokeWidth="2" strokeLinecap="round" animate={{ rotate: angle }} transition={{ type: "spring", stiffness: 50 }} style={{ transformOrigin: '32px 40px' }} />
      <circle cx="32" cy="40" r="4" fill="#fff" />
    </motion.svg>
  );
};

// Step: Graph/Analytics
export const StepGraphIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="8" y="8" width="48" height="48" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <motion.path d="M14 46 L24 34 L34 40 L44 22 L52 26" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
      <motion.circle cx="24" cy="34" r="3" fill="#22c55e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
      <motion.circle cx="34" cy="40" r="3" fill="#22c55e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="44" cy="22" r="3" fill="#22c55e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
    </motion.svg>
  );
};

// Step: Compass/Navigation
export const StepCompassIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx="32" cy="32" r="26" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#2a2a2a" strokeWidth="1" />
      <motion.g animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: '32px 32px' }}>
        <path d="M32 10 L36 32 L32 38 L28 32 Z" fill="#ef4444" />
        <path d="M32 54 L36 32 L32 26 L28 32 Z" fill="#fff" />
      </motion.g>
      <circle cx="32" cy="32" r="4" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
      <text x="32" y="10" textAnchor="middle" fill="#888" fontSize="6">N</text>
    </motion.svg>
  );
};

// Step: Sparkles/Magic
export const StepSparklesIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M32 4 L34 18 L48 20 L34 22 L32 36 L30 22 L16 20 L30 18 Z" fill="#eab308" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: '32px 20px' }} />
      <motion.path d="M18 36 L20 44 L28 46 L20 48 L18 56 L16 48 L8 46 L16 44 Z" fill="#ff6b35" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} style={{ transformOrigin: '18px 46px' }} />
      <motion.path d="M48 38 L49 44 L55 45 L49 46 L48 52 L47 46 L41 45 L47 44 Z" fill="#3b82f6" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }} style={{ transformOrigin: '48px 45px' }} />
    </motion.svg>
  );
};

// Step: Book/Documentation
export const StepBookIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M10 12 Q10 8 14 8 L50 8 Q54 8 54 12 L54 52 Q54 56 50 56 L14 56 Q10 56 10 52 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="10" y="8" width="6" height="48" fill="#ff6b35" />
      <rect x="20" y="16" width="24" height="3" rx="1" fill="#3a3a3a" />
      <rect x="20" y="24" width="28" height="2" rx="1" fill="#2a2a2a" />
      <rect x="20" y="30" width="26" height="2" rx="1" fill="#2a2a2a" />
      <rect x="20" y="36" width="28" height="2" rx="1" fill="#2a2a2a" />
      <rect x="20" y="42" width="20" height="2" rx="1" fill="#2a2a2a" />
    </motion.svg>
  );
};

// Step: Package/Box
export const StepPackageIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.g initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <path d="M32 4 L56 16 L56 48 L32 60 L8 48 L8 16 Z" fill="#1a1a1a" stroke="#c0a060" strokeWidth="1.5" />
        <path d="M32 4 L32 60" stroke="#c0a060" strokeWidth="1" />
        <path d="M8 16 L32 28 L56 16" fill="none" stroke="#c0a060" strokeWidth="1" />
        <path d="M32 28 L32 60" stroke="#c0a060" strokeWidth="1" />
      </motion.g>
      <motion.path d="M20 10 L32 4 L44 10 L32 16 Z" fill="#c0a060" opacity="0.3" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
    </motion.svg>
  );
};

// =====================================================
// NEW UNIQUE PAGE ILLUSTRATIONS
// =====================================================

// Unboxing/Setup Illustration - Laptop lid opening with welcome glow
export const UnboxingIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Base/keyboard */}
      <path d="M6 48 L10 48 Q10 46 12 46 L52 46 Q54 46 54 48 L58 48 L56 56 Q55 58 52 58 L12 58 Q9 58 8 56 Z" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.5" />
      
      {/* Keyboard keys hint */}
      <g opacity="0.4">
        {[0,1,2,3,4,5].map(i => <rect key={`k${i}`} x={16 + i*5} y="50" width="3" height="2" rx="0.3" fill="#2a2a2a" />)}
      </g>
      
      {/* Trackpad */}
      <rect x="26" y="53" width="12" height="3" rx="0.5" fill="#2a2a2a" />
      
      {/* Screen - angled open */}
      <motion.g
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
        style={{ transformOrigin: '32px 46px' }}
      >
        {/* Screen frame */}
        <path d="M10 10 L54 10 Q56 10 56 12 L56 44 Q56 46 54 46 L10 46 Q8 46 8 44 L8 12 Q8 10 10 10 Z" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="0.8" strokeOpacity="0.5" />
        
        {/* Screen */}
        <rect x="11" y="13" width="42" height="30" rx="1" fill="#0a0a0a" />
        
        {/* Welcome glow */}
        <motion.rect 
          x="11" y="13" width="42" height="30" rx="1" 
          fill="url(#welcomeGlow)" 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Welcome text simulation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <rect x="20" y="22" width="24" height="3" rx="1" fill="#ff6b35" opacity="0.9" />
          <rect x="18" y="28" width="28" height="2" rx="1" fill="#3a3a3a" />
          <rect x="22" y="33" width="20" height="2" rx="1" fill="#2a2a2a" />
        </motion.g>
        
        {/* Webcam */}
        <circle cx="32" cy="11.5" r="1" fill="#2a2a2a" />
      </motion.g>
      
      {/* RGB light strip */}
      <motion.rect 
        x="12" y="46" width="40" height="1" rx="0.5" 
        fill="url(#rgbUnbox)" 
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <defs>
        <radialGradient id="welcomeGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rgbUnbox" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" /><stop offset="33%" stopColor="#00ff00" />
          <stop offset="66%" stopColor="#0066ff" /><stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Driver/Software Illustration - Software download and install
export const DriverChipIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const progress = useDynamicValue(20, 100, 3000);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Monitor/Window */}
      <rect x="8" y="8" width="48" height="36" rx="2" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.8" />
      <rect x="10" y="10" width="44" height="32" rx="1" fill="#0a0a0a" />
      
      {/* Title bar */}
      <rect x="10" y="10" width="44" height="5" fill="#2a2a2a" />
      <circle cx="14" cy="12.5" r="1.2" fill="#ff5f57" />
      <circle cx="18" cy="12.5" r="1.2" fill="#febc2e" />
      <circle cx="22" cy="12.5" r="1.2" fill="#28c840" />
      
      {/* Download icon in window */}
      <motion.g
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <path d="M32 20 L32 30" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M27 27 L32 32 L37 27" stroke="#ff6b35" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      
      {/* Progress bar background */}
      <rect x="16" y="36" width="32" height="3" rx="1.5" fill="#2a2a2a" />
      
      {/* Progress bar fill */}
      <motion.rect 
        x="16" y="36" 
        width={(progress / 100) * 32} 
        height="3" 
        rx="1.5" 
        fill="url(#progressGradient)" 
      />
      
      {/* Monitor stand */}
      <path d="M26 44 L38 44 L36 50 L28 50 Z" fill="#2a2a2a" />
      <rect x="22" y="50" width="20" height="2" rx="1" fill="#3a3a3a" />
      
      {/* Floating software icons */}
      <motion.g
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <rect x="4" y="52" width="8" height="8" rx="1.5" fill="#22c55e" opacity="0.7" />
        <rect x="52" y="52" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.7" />
      </motion.g>
      
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Tuning/Configuration Illustration - Stylized power/performance visualization
export const TuningIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const powerLevel = useDynamicValue(65, 95, 2500);
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="perfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <circle cx="32" cy="32" r="30" fill="url(#perfGlow)" />
      
      {/* Hexagonal frame */}
      <motion.path
        d="M32 6 L54 18 L54 46 L32 58 L10 46 L10 18 Z"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      
      {/* Inner hexagon */}
      <path
        d="M32 14 L48 23 L48 41 L32 50 L16 41 L16 23 Z"
        fill="#0a0a0a"
        stroke="#2a2a2a"
        strokeWidth="0.5"
      />
      
      {/* Lightning bolt - power symbol */}
      <motion.path
        d="M36 18 L30 30 L35 30 L28 44 L38 32 L33 32 Z"
        fill="#ff6b35"
        stroke="#ff8c5a"
        strokeWidth="0.5"
        animate={{ 
          filter: ['drop-shadow(0 0 2px #ff6b35)', 'drop-shadow(0 0 6px #ff6b35)', 'drop-shadow(0 0 2px #ff6b35)']
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Orbiting performance indicators */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '32px 32px' }}
      >
        <circle cx="32" cy="8" r="2" fill="#22c55e" opacity="0.8" />
        <circle cx="56" cy="32" r="1.5" fill="#eab308" opacity="0.6" />
        <circle cx="32" cy="56" r="1.5" fill="#ff6b35" opacity="0.7" />
        <circle cx="8" cy="32" r="1" fill="#3b82f6" opacity="0.5" />
      </motion.g>
      
      {/* Speed lines radiating out */}
      {[45, 90, 135, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + Math.cos(rad) * 24;
        const y1 = 32 + Math.sin(rad) * 24;
        const x2 = 32 + Math.cos(rad) * 28;
        const y2 = 32 + Math.sin(rad) * 28;
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#ff6b35"
            strokeWidth="1"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        );
      })}
      
      {/* Performance percentage */}
      <text x="32" y="54" textAnchor="middle" fill="#888" fontSize="4">{Math.round(powerLevel)}%</text>
    </motion.svg>
  );
};

// Diagnostics/Troubleshooting Illustration - Magnifying glass with checklist
export const DiagnosticsIllustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const [checkIndex, setCheckIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setCheckIndex(i => (i + 1) % 4), 1500);
    return () => clearInterval(timer);
  }, []);
  
  const { class: sizeClass } = sizeMap[size];
  
  return (
    <motion.svg 
      viewBox="0 0 64 64" 
      className={`${sizeClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Clipboard background */}
      <rect x="8" y="10" width="32" height="48" rx="2" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="16" y="6" width="16" height="8" rx="2" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="24" cy="10" r="2" fill="#3a3a3a" />
      
      {/* Checklist items - 4 items with spacing of 9 */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x="12" y={18 + i * 9} width="7" height="7" rx="1" fill={checkIndex > i ? '#22c55e' : '#2a2a2a'} stroke="#3a3a3a" strokeWidth="0.5" />
          {checkIndex > i && (
            <motion.path
              d={`M14 ${21.5 + i * 9} L15.5 ${23 + i * 9} L19 ${20 + i * 9}`}
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <rect x="22" y={19 + i * 9} width="14" height="2" rx="1" fill="#3a3a3a" opacity={checkIndex > i ? 0.5 : 1} />
          <rect x="22" y={22 + i * 9} width="10" height="1.5" rx="1" fill="#2a2a2a" opacity={checkIndex > i ? 0.3 : 0.6} />
        </g>
      ))}
      
      {/* Magnifying glass */}
      <motion.g
        animate={{ 
          x: [0, 3, 0, -3, 0],
          y: [0, -2, 0, 2, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <circle cx="48" cy="28" r="12" fill="none" stroke="#ff6b35" strokeWidth="2.5" />
        <circle cx="48" cy="28" r="10" fill="#0a0a0a" opacity="0.5" />
        <line x1="56" y1="38" x2="60" y2="50" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" />
        
        {/* Magnifying glass shine */}
        <motion.path
          d="M42 22 Q48 18 52 24"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.3"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>
    </motion.svg>
  );
};

// Map page IDs to illustrations
export const getPageIllustration = (pageId: string): React.FC<IllustrationProps> | null => {
  const illustrationMap: Record<string, React.FC<IllustrationProps>> = {
    // Display & Audio
    'display-audio': MonitorIllustration,
    'display': MonitorIllustration,
    'audio': AudioIllustration,
    'sound': AudioIllustration,
    
    // GPU
    'gpu-opt': GPUIllustration,
    'gpu': GPUIllustration,
    'graphics': GPUIllustration,
    
    // CPU
    'cpu-opt': CPUIllustration,
    'cpu': CPUIllustration,
    'processor': CPUIllustration,
    
    // Thermal
    'thermal-mgmt': ThermalIllustration,
    'thermal-config': ThermalIllustration,
    'thermal': ThermalIllustration,
    'cooling': ThermalIllustration,
    
    // Storage
    'storage-opt': StorageIllustration,
    'storage': StorageIllustration,
    'ssd': StorageIllustration,
    
    // Security (shield)
    'security-updates': UpdateIllustration,
    'security': SecurityIllustration,
    'antivirus': SecurityIllustration,
    'firewall': SecurityIllustration,
    
    // Gaming
    'gaming-setup': GamingIllustration,
    'gaming': GamingIllustration,
    
    // System/Laptop - use new unboxing illustration
    'quickstart': GuideBookIllustration,
    'guide': GuideBookIllustration,
    'unboxing-setup': UnboxingIllustration,
    'system': SettingsIllustration,
    
    // Drivers - use new chip illustration
    'driver-management': DriverChipIllustration,
    'drivers': DriverChipIllustration,
    'software-installation': DriverChipIllustration,
    
    // Performance - use new tuning illustration
    'performance': TuningIllustration,
    'performance-opt': TuningIllustration,
    'performance-config': TuningIllustration,
    
    // Backup (cloud - different from security!)
    'backup': BackupIllustration,
    'backup-recovery': BackupIllustration,
    'restore': BackupIllustration,
    'data': BackupIllustration,
    
    // Windows
    'windows-tips': WindowsIllustration,
    'windows': WindowsIllustration,
    'os': WindowsIllustration,
    
    // Network
    'network-config': NetworkIllustration,
    'network': NetworkIllustration,
    'wifi': NetworkIllustration,
    'connectivity': NetworkIllustration,
    
    // Battery
    'battery-opt': BatteryIllustration,
    'battery': BatteryIllustration,
    'power-management': BatteryIllustration,
    
    // BIOS
    'bios-settings': BiosIllustration,
    'bios': BiosIllustration,
    'uefi': BiosIllustration,
    'firmware': BiosIllustration,
    
    // RAM
    'memory': RamIllustration,
    'ram': RamIllustration,
    
    // Keyboard
    'keyboard': KeyboardIllustration,
    'input': KeyboardIllustration,
    'peripherals': KeyboardIllustration,
    
    // Updates
    'updates': UpdateIllustration,
    'windows-update': UpdateIllustration,
    
    // Settings
    'settings': SettingsIllustration,
    'configuration': SettingsIllustration,
    'preferences': SettingsIllustration,
    
    // Troubleshooting - use new diagnostics illustration
    'troubleshooting': DiagnosticsIllustration,
    'issues': DiagnosticsIllustration,
    'fixes': DiagnosticsIllustration,
    'common-issues': DiagnosticsIllustration,
    'known-issues': DiagnosticsIllustration,
    
    // Files
    'files': FolderIllustration,
    'folder': FolderIllustration,
    'organize': FolderIllustration,
  };
  return illustrationMap[pageId] || GuideBookIllustration;
};

// =====================================================
// STEP ILLUSTRATIONS - Context-aware keyword matching
// Each step gets an icon that MATCHES what it's about
// =====================================================

// Step: RGB Keyboard (for RGB/lighting related steps)
export const StepRGBKeyboardIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="6" y="20" width="52" height="28" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      {/* Animated RGB keys */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.rect 
          key={`k${i}`} x={10 + i*6} y="24" width="4" height="4" rx="0.5" 
          animate={{ fill: ['#ff0000', '#ff6b35', '#22c55e', '#3b82f6', '#a855f7', '#ff0000'] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.rect 
          key={`k2${i}`} x={10 + i*6} y="30" width="4" height="4" rx="0.5" 
          animate={{ fill: ['#3b82f6', '#a855f7', '#ff0000', '#ff6b35', '#22c55e', '#3b82f6'] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      {/* Spacebar with glow */}
      <motion.rect x="16" y="38" width="32" height="5" rx="1" fill="#2a2a2a" animate={{ boxShadow: ['0 0 5px #ff6b35', '0 0 5px #3b82f6', '0 0 5px #22c55e'] }} />
      {/* RGB strip at bottom */}
      <motion.rect x="6" y="46" width="52" height="2" rx="1" 
        animate={{ fill: ['#ff0000', '#ff6b35', '#22c55e', '#3b82f6', '#a855f7', '#ff0000'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.svg>
  );
};

// Step: Monitor Screen (for display/screen related steps)
export const StepMonitorIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="8" y="8" width="48" height="32" rx="3" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="11" y="11" width="42" height="26" rx="2" fill="#0a0a0a" />
      <motion.rect x="11" y="11" width="42" height="26" rx="2" fill="#3b82f6" opacity="0.1" animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} />
      <path d="M26 40 L38 40 L36 48 L28 48 Z" fill="#2a2a2a" />
      <ellipse cx="32" cy="50" rx="10" ry="2" fill="#1a1a1a" />
      {/* Content */}
      <rect x="15" y="16" width="16" height="2" rx="1" fill="#3b82f6" opacity="0.8" />
      <rect x="15" y="20" width="34" height="1" rx="0.5" fill="#3a3a3a" />
      <rect x="15" y="23" width="30" height="1" rx="0.5" fill="#3a3a3a" />
    </motion.svg>
  );
};

// Step: GPU Card (for graphics/GPU related steps)
export const StepGPUIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="6" y="16" width="52" height="32" rx="3" fill="#1a1a1a" stroke="#76b900" strokeWidth="1.5" />
      {/* Fans */}
      <circle cx="22" cy="32" r="10" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '22px 32px' }}>
        {[0, 90, 180, 270].map((a, i) => <path key={i} d={`M22 32 L${22 + 8*Math.cos(a*Math.PI/180)} ${32 + 8*Math.sin(a*Math.PI/180)} A8 8 0 0 1 ${22 + 8*Math.cos((a+60)*Math.PI/180)} ${32 + 8*Math.sin((a+60)*Math.PI/180)} Z`} fill="#2a2a2a" />)}
      </motion.g>
      <circle cx="44" cy="32" r="10" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '44px 32px' }}>
        {[0, 90, 180, 270].map((a, i) => <path key={i} d={`M44 32 L${44 + 8*Math.cos(a*Math.PI/180)} ${32 + 8*Math.sin(a*Math.PI/180)} A8 8 0 0 1 ${44 + 8*Math.cos((a+60)*Math.PI/180)} ${32 + 8*Math.sin((a+60)*Math.PI/180)} Z`} fill="#2a2a2a" />)}
      </motion.g>
      <motion.rect x="6" y="45" width="52" height="3" rx="1" fill="#76b900" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Thermometer (for temperature/thermal steps)
export const StepThermometerIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const temp = useDynamicValue(40, 80, 2000);
  const { class: sizeClass } = sizeMap[size];
  const tempColor = temp < 55 ? '#22c55e' : temp < 70 ? '#eab308' : '#ef4444';
  const fillHeight = 28 * (temp / 100);
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="26" y="8" width="12" height="36" rx="6" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="32" cy="50" r="10" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <motion.rect x="28" y={44 - fillHeight} width="8" height={fillHeight} rx="2" fill={tempColor} key={temp} />
      <motion.circle cx="32" cy="50" r="7" fill={tempColor} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      <text x="48" y="36" fill={tempColor} fontSize="10" fontWeight="bold">{temp}°</text>
    </motion.svg>
  );
};

// Step: Fan/Cooling (for fan/cooling steps)
export const StepFanIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const rpm = useDynamicValue(1500, 3000, 2000);
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx="32" cy="32" r="26" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 60000 / rpm, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '32px 32px' }}>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path key={i} d={`M32 32 L${32 + 20 * Math.cos(angle * Math.PI / 180)} ${32 + 20 * Math.sin(angle * Math.PI / 180)} A20 20 0 0 1 ${32 + 20 * Math.cos((angle + 50) * Math.PI / 180)} ${32 + 20 * Math.sin((angle + 50) * Math.PI / 180)} Z`} fill="#3b82f6" opacity="0.8" />
        ))}
      </motion.g>
      <circle cx="32" cy="32" r="6" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1" />
      <text x="32" y="60" textAnchor="middle" fill="#888" fontSize="6">{rpm} RPM</text>
    </motion.svg>
  );
};

// Step: Hard Drive/SSD (for storage steps)
export const StepStorageIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="8" y="12" width="48" height="40" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1.5" />
      <rect x="14" y="18" width="36" height="6" rx="2" fill="#0a0a0a" />
      <motion.rect x="14" y="18" width="28" height="6" rx="2" fill="#22c55e" animate={{ width: [20, 32, 24, 28] }} transition={{ duration: 3, repeat: Infinity }} />
      <rect x="14" y="28" width="36" height="6" rx="2" fill="#0a0a0a" />
      <motion.rect x="14" y="28" width="16" height="6" rx="2" fill="#3b82f6" animate={{ width: [10, 24, 16, 20] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <rect x="14" y="42" width="8" height="4" rx="1" fill="#2a2a2a" />
      <motion.circle cx="50" cy="44" r="3" fill="#22c55e" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Shield/Security (for security steps)
export const StepShieldIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M32 6 L54 14 L54 32 Q54 50 32 58 Q10 50 10 32 L10 14 Z" fill="#1a1a1a" stroke="#22c55e" strokeWidth="2" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M24 32 L30 38 L42 26" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
    </motion.svg>
  );
};

// Step: Cloud Upload/Backup (for backup/cloud steps)
export const StepCloudIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M16 40 Q6 40 6 32 Q6 24 14 22 Q16 12 28 10 Q42 8 48 18 Q56 18 58 26 Q60 36 52 40 Z" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="1.5" />
      <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <path d="M26 48 L32 40 L38 48" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="40" x2="32" y2="56" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  );
};

// Step: WiFi/Network (for network/wifi steps)
export const StepWiFiIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M4 24 Q32 4 60 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
      <motion.path d="M12 32 Q32 16 52 32" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
      <motion.path d="M20 40 Q32 28 44 40" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="32" cy="50" r="5" fill="#22c55e" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Battery (for battery/power steps)
export const StepBatteryIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const charge = useDynamicValue(40, 95, 3000);
  const { class: sizeClass } = sizeMap[size];
  const chargeColor = charge < 30 ? '#ef4444' : charge < 60 ? '#eab308' : '#22c55e';
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="6" y="18" width="48" height="28" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
      <rect x="54" y="26" width="4" height="12" rx="1" fill="#3a3a3a" />
      <motion.rect x="10" y="22" width={40 * charge / 100} height="20" rx="2" fill={chargeColor} key={charge} />
      <text x="32" y="36" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{charge}%</text>
    </motion.svg>
  );
};

// Step: CPU Chip (for CPU/processor steps)
export const StepCPUIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const usage = useDynamicValue(20, 90, 1500);
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="16" y="16" width="32" height="32" rx="2" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" />
      {/* Pins */}
      {[0,1,2,3,4].map(i => <rect key={`t${i}`} x={20 + i*6} y="8" width="3" height="8" fill="#c0a060" />)}
      {[0,1,2,3,4].map(i => <rect key={`b${i}`} x={20 + i*6} y="48" width="3" height="8" fill="#c0a060" />)}
      {[0,1,2,3,4].map(i => <rect key={`l${i}`} x="8" y={20 + i*6} width="8" height="3" fill="#c0a060" />)}
      {[0,1,2,3,4].map(i => <rect key={`r${i}`} x="48" y={20 + i*6} width="8" height="3" fill="#c0a060" />)}
      {/* Core with usage */}
      <rect x="22" y="22" width="20" height="20" rx="1" fill="#0a0a0a" />
      <motion.rect x="22" y="22" width="20" height="20" rx="1" fill="#ff6b35" opacity={usage / 150} key={usage} />
      <text x="32" y="36" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{usage}%</text>
    </motion.svg>
  );
};

// Step: BIOS Chip (for BIOS/firmware steps)
export const StepBIOSIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="12" y="12" width="40" height="40" rx="3" fill="#1a472a" stroke="#22c55e" strokeWidth="1.5" />
      {/* Pins */}
      {[0,1,2,3,4,5].map(i => <rect key={`b${i}`} x={17 + i*5} y="52" width="2" height="6" fill="#c0a060" />)}
      {/* BIOS label */}
      <rect x="18" y="18" width="28" height="10" rx="1" fill="#0a0a0a" />
      <text x="32" y="26" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="bold">BIOS</text>
      {/* Circuit traces */}
      <motion.path d="M18 34 L28 34 L28 44 M36 34 L46 34 M36 40 L46 40 M36 46 L42 46" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: RAM Module (for memory/RAM steps)
export const StepRAMIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="6" y="16" width="52" height="24" rx="2" fill="#1a472a" stroke="#22c55e" strokeWidth="1" />
      {/* Memory chips */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.rect key={i} x={10 + i*6} y="20" width="4" height="16" rx="0.5" fill="#0a0a0a" animate={{ fill: ['#0a0a0a', '#1a1a1a', '#0a0a0a'] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
      ))}
      {/* Contact pins */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
        <rect key={`p${i}`} x={10 + i*3.5} y="40" width="2" height="8" fill="#c0a060" />
      ))}
      {/* Notch */}
      <rect x="30" y="40" width="4" height="4" fill="#1a1a1a" />
    </motion.svg>
  );
};

// Step: Gamepad (for gaming steps)
export const StepGamepadIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M10 26 Q4 26 4 32 L4 42 Q4 50 12 50 L18 50 Q22 50 24 46 L28 38 L36 38 L40 46 Q42 50 46 50 L52 50 Q60 50 60 42 L60 32 Q60 26 54 26 Z" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1.5" />
      {/* D-pad */}
      <rect x="14" y="32" width="4" height="10" rx="1" fill="#2a2a2a" />
      <rect x="11" y="35" width="10" height="4" rx="1" fill="#2a2a2a" />
      {/* Buttons */}
      <motion.circle cx="48" cy="34" r="3" fill="#22c55e" animate={{ scale: [1, 0.9, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
      <motion.circle cx="44" cy="38" r="3" fill="#ef4444" animate={{ scale: [1, 0.9, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }} />
      <circle cx="52" cy="38" r="3" fill="#3b82f6" />
      <circle cx="48" cy="42" r="3" fill="#eab308" />
      {/* Analog sticks */}
      <circle cx="24" cy="42" r="4" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
      <circle cx="40" cy="42" r="4" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
    </motion.svg>
  );
};

// Step: Audio Speaker (for audio/sound steps)
export const StepAudioIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M8 24 L8 40 L18 40 L32 52 L32 12 L18 24 Z" fill="#1a1a1a" stroke="#a855f7" strokeWidth="1.5" />
      <motion.path d="M40 22 Q50 32 40 42" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
      <motion.path d="M46 16 Q60 32 46 48" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
    </motion.svg>
  );
};

// Step: Power Button (for power/startup steps)
export const StepPowerIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.circle cx="32" cy="34" r="22" fill="#1a1a1a" stroke="#22c55e" strokeWidth="3" animate={{ boxShadow: ['0 0 10px #22c55e', '0 0 20px #22c55e', '0 0 10px #22c55e'] }} />
      <motion.path d="M32 12 L32 34" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M20 20 A18 18 0 1 0 44 20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.svg>
  );
};

// Step: Windows Logo (for Windows steps)
export const StepWindowsIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M6 14 L28 10 L28 30 L6 30 Z" fill="#0078d4" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.path d="M32 9 L58 4 L58 30 L32 30 Z" fill="#0078d4" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M6 34 L28 34 L28 54 L6 50 Z" fill="#0078d4" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.path d="M32 34 L58 34 L58 60 L32 55 Z" fill="#0078d4" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} />
    </motion.svg>
  );
};

// Step: Restart/Refresh Arrow (for restart/reboot steps)
export const StepRestartIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path d="M32 8 A24 24 0 1 1 8 32" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '32px 32px' }} />
      <motion.path d="M32 4 L40 12 L32 20" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
};

// Step: Pencil/Edit (for configure/edit steps)
export const StepEditIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ transformOrigin: '32px 32px' }}>
        <path d="M12 52 L8 56 L16 56 Z" fill="#eab308" />
        <rect x="14" y="12" width="8" height="42" rx="1" fill="#eab308" transform="rotate(45 32 32)" />
        <rect x="14" y="6" width="8" height="8" rx="1" fill="#2a2a2a" transform="rotate(45 32 32)" />
      </motion.g>
    </motion.svg>
  );
};

// Step: Folder/Files (for file/folder steps)
export const StepFolderIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <path d="M4 16 L4 52 Q4 56 8 56 L56 56 Q60 56 60 52 L60 22 Q60 18 56 18 L30 18 L26 12 Q24 8 20 8 L8 8 Q4 8 4 12 Z" fill="#eab308" />
      <rect x="8" y="22" width="48" height="30" rx="2" fill="#ca8a04" />
      <motion.rect x="16" y="30" width="20" height="2" rx="1" fill="#fff" opacity="0.3" />
      <motion.rect x="16" y="36" width="32" height="2" rx="1" fill="#fff" opacity="0.2" />
      <motion.rect x="16" y="42" width="28" height="2" rx="1" fill="#fff" opacity="0.2" />
    </motion.svg>
  );
};

// Step: Driver/Install (for driver steps)
export const StepDriverIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="10" y="8" width="44" height="48" rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="16" y="14" width="32" height="4" rx="1" fill="#3b82f6" />
      <rect x="16" y="22" width="28" height="2" rx="1" fill="#2a2a2a" />
      <rect x="16" y="28" width="24" height="2" rx="1" fill="#2a2a2a" />
      <motion.g animate={{ y: [0, 2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
        <circle cx="32" cy="44" r="8" fill="#22c55e" opacity="0.2" />
        <path d="M28 44 L32 48 L40 38" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  );
};

// Step: Update/Arrow Down (for update steps)
export const StepUpdateIcon: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  const { class: sizeClass } = sizeMap[size];
  return (
    <motion.svg viewBox="0 0 64 64" className={`${sizeClass} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx="32" cy="32" r="24" fill="#1a1a1a" stroke="#22c55e" strokeWidth="2" />
      <motion.g animate={{ y: [-3, 3, -3] }} transition={{ duration: 1, repeat: Infinity }}>
        <rect x="28" y="16" width="8" height="20" rx="2" fill="#22c55e" />
        <path d="M22 34 L32 46 L42 34 Z" fill="#22c55e" />
      </motion.g>
    </motion.svg>
  );
};

// Keyword-based context matching for step illustrations
// Maps keywords to their most appropriate illustration
const stepKeywordMap: Array<{ keywords: string[]; icon: React.FC<IllustrationProps> }> = [
  // RGB/Lighting - keyboard with RGB
  { keywords: ['rgb', 'lighting', 'backlight', 'led', 'color', 'omen light', 'light studio'], icon: StepRGBKeyboardIcon },
  
  // Display/Monitor
  { keywords: ['display', 'monitor', 'screen', 'resolution', 'refresh rate', 'hz', 'vsync', 'gsync', 'freesync'], icon: StepMonitorIcon },
  
  // GPU/Graphics  
  { keywords: ['gpu', 'graphics', 'nvidia', 'amd', 'geforce', 'radeon', 'rtx', 'video card', 'frame'], icon: StepGPUIcon },
  
  // Temperature/Thermal
  { keywords: ['temperature', 'thermal', 'heat', 'overheat', 'hot', 'temp', 'throttle', 'celsius', 'fahrenheit'], icon: StepThermometerIcon },
  
  // Fan/Cooling
  { keywords: ['fan', 'cooling', 'rpm', 'airflow', 'vent', 'exhaust', 'intake', 'cooler'], icon: StepFanIcon },
  
  // Storage/SSD/HDD
  { keywords: ['storage', 'ssd', 'hdd', 'hard drive', 'disk', 'nvme', 'm.2', 'partition', 'format'], icon: StepStorageIcon },
  
  // Security
  { keywords: ['security', 'antivirus', 'firewall', 'protect', 'malware', 'virus', 'defender', 'safe'], icon: StepShieldIcon },
  
  // Backup/Cloud
  { keywords: ['backup', 'cloud', 'restore', 'recovery', 'sync', 'upload', 'save data'], icon: StepCloudIcon },
  
  // Network/WiFi
  { keywords: ['wifi', 'network', 'internet', 'ethernet', 'lan', 'connection', 'router', 'wireless', 'bluetooth'], icon: StepWiFiIcon },
  
  // Battery/Power
  { keywords: ['battery', 'charge', 'power plan', 'power mode', 'battery life', 'unplug', 'ac adapter'], icon: StepBatteryIcon },
  
  // CPU/Processor
  { keywords: ['cpu', 'processor', 'core', 'thread', 'clock', 'ghz', 'intel', 'ryzen', 'turbo boost'], icon: StepCPUIcon },
  
  // BIOS/UEFI
  { keywords: ['bios', 'uefi', 'firmware', 'boot', 'cmos', 'f10', 'setup utility'], icon: StepBIOSIcon },
  
  // RAM/Memory
  { keywords: ['ram', 'memory', 'ddr', 'dimm', 'sodimm', 'gb', 'dual channel', 'xmp'], icon: StepRAMIcon },
  
  // Gaming
  { keywords: ['game', 'gaming', 'play', 'fps', 'steam', 'launcher', 'performance mode'], icon: StepGamepadIcon },
  
  // Audio/Sound
  { keywords: ['audio', 'sound', 'speaker', 'headphone', 'microphone', 'volume', 'realtek', 'bang & olufsen'], icon: StepAudioIcon },
  
  // Power/Startup
  { keywords: ['power button', 'turn on', 'start up', 'boot up', 'shutdown', 'sleep', 'hibernate'], icon: StepPowerIcon },
  
  // Windows specific
  { keywords: ['windows', 'microsoft', 'win10', 'win11', 'start menu', 'taskbar', 'control panel', 'registry'], icon: StepWindowsIcon },
  
  // Restart/Reboot
  { keywords: ['restart', 'reboot', 'reset', 'refresh', 'reload'], icon: StepRestartIcon },
  
  // Download/Install
  { keywords: ['download', 'install', 'setup', 'wizard', 'exe', 'msi'], icon: StepDownloadIcon },
  
  // Driver
  { keywords: ['driver', 'device manager', 'update driver', 'rollback'], icon: StepDriverIcon },
  
  // Update/Upgrade
  { keywords: ['update', 'upgrade', 'patch', 'latest version', 'new version'], icon: StepUpdateIcon },
  
  // Configure/Edit
  { keywords: ['configure', 'edit', 'modify', 'change', 'customize', 'tweak', 'adjust'], icon: StepEditIcon },
  
  // Settings/Options
  { keywords: ['setting', 'option', 'preference', 'menu', 'panel'], icon: StepSlidersIcon },
  
  // Files/Folder
  { keywords: ['file', 'folder', 'directory', 'path', 'browse', 'navigate', 'explorer'], icon: StepFolderIcon },
  
  // Terminal/Command
  { keywords: ['terminal', 'command', 'cmd', 'powershell', 'prompt', 'cli', 'script'], icon: StepTerminalIcon },
  
  // Check/Verify
  { keywords: ['check', 'verify', 'confirm', 'ensure', 'test', 'validate'], icon: StepChecklistIcon },
  
  // Performance/Speed
  { keywords: ['performance', 'speed', 'fast', 'boost', 'optimize', 'benchmark'], icon: StepRocketIcon },
  
  // Connection/Plug
  { keywords: ['connect', 'plug', 'cable', 'port', 'usb', 'hdmi', 'thunderbolt'], icon: StepPlugIcon },
  
  // Lock/Secure
  { keywords: ['lock', 'password', 'encrypt', 'pin', 'login', 'sign in'], icon: StepLockIcon },
];

// Fallback icons for when no keyword matches (used with hash for variety)
const fallbackStepIcons = [
  StepLightbulbIcon,
  StepTargetIcon,
  StepTimerIcon,
  StepZapIcon,
  StepLayersIcon,
  StepGaugeIcon,
  StepGraphIcon,
  StepCompassIcon,
  StepSparklesIcon,
  StepBookIcon,
  StepPackageIcon,
];

// Get contextually appropriate step illustration based on step title
export const getStepIllustration = (stepTitle: string): React.FC<IllustrationProps> | null => {
  const titleLower = stepTitle.toLowerCase();
  
  // Find matching keyword category
  for (const { keywords, icon } of stepKeywordMap) {
    for (const keyword of keywords) {
      if (titleLower.includes(keyword)) {
        return icon;
      }
    }
  }
  
  // If no keyword match, use hash-based fallback for variety
  let hash = 0;
  for (let i = 0; i < stepTitle.length; i++) {
    hash = ((hash << 5) - hash) + stepTitle.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % fallbackStepIcons.length;
  return fallbackStepIcons[index];
};

export default {
  MonitorIllustration,
  GPUIllustration,
  CPUIllustration,
  ThermalIllustration,
  StorageIllustration,
  SecurityIllustration,
  GamingIllustration,
  LaptopIllustration,
  DriverIllustration,
  PerformanceIllustration,
  AudioIllustration,
  BackupIllustration,
  WindowsIllustration,
  NetworkIllustration,
  BatteryIllustration,
  BiosIllustration,
  RamIllustration,
  KeyboardIllustration,
  UpdateIllustration,
  SettingsIllustration,
  FolderIllustration,
  ToolsIllustration,
  PowerIllustration,
  GuideBookIllustration,
  // Context-aware step icons
  StepRGBKeyboardIcon,
  StepMonitorIcon,
  StepGPUIcon,
  StepThermometerIcon,
  StepFanIcon,
  StepStorageIcon,
  StepShieldIcon,
  StepCloudIcon,
  StepWiFiIcon,
  StepBatteryIcon,
  StepCPUIcon,
  StepBIOSIcon,
  StepRAMIcon,
  StepGamepadIcon,
  StepAudioIcon,
  StepPowerIcon,
  StepWindowsIcon,
  StepRestartIcon,
  StepEditIcon,
  StepFolderIcon,
  StepDriverIcon,
  StepUpdateIcon,
  StepLightbulbIcon,
  StepChecklistIcon,
  StepRocketIcon,
  StepTargetIcon,
  StepTimerIcon,
  StepDownloadIcon,
  StepLockIcon,
  StepSlidersIcon,
  StepTerminalIcon,
  StepWrenchIcon,
  StepPlugIcon,
  StepEyeIcon,
  StepZapIcon,
  StepChipIcon,
  StepLayersIcon,
  StepGaugeIcon,
  StepGraphIcon,
  StepCompassIcon,
  StepSparklesIcon,
  StepBookIcon,
  StepPackageIcon,
  getPageIllustration,
  getStepIllustration,
};
