import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ComponentData = {
  id: string;
  label: string;
  status: 'scanning' | 'ready' | 'active';
  temp?: number;
  usage?: number;
};

const HardwareSkeleton = () => {
  const [components, setComponents] = useState<ComponentData[]>([
    { id: 'cpu', label: 'CPU', status: 'scanning' },
    { id: 'gpu', label: 'GPU', status: 'scanning' },
    { id: 'ram', label: 'RAM', status: 'scanning' },
  ]);
  const [phase, setPhase] = useState<'scan' | 'monitor'>('scan');

  // Scan phase - components come online one by one
  useEffect(() => {
    if (phase === 'scan') {
      const timers = [
        setTimeout(() => {
          setComponents(prev => prev.map(c => 
            c.id === 'cpu' ? { ...c, status: 'ready', temp: 45, usage: 12 } : c
          ));
        }, 800),
        setTimeout(() => {
          setComponents(prev => prev.map(c => 
            c.id === 'gpu' ? { ...c, status: 'ready', temp: 52, usage: 8 } : c
          ));
        }, 1400),
        setTimeout(() => {
          setComponents(prev => prev.map(c => 
            c.id === 'ram' ? { ...c, status: 'ready', temp: 38, usage: 34 } : c
          ));
        }, 2000),
        setTimeout(() => {
          setPhase('monitor');
        }, 2600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  // Monitor phase - simulate live stats
  useEffect(() => {
    if (phase === 'monitor') {
      const interval = setInterval(() => {
        setComponents(prev => prev.map(c => ({
          ...c,
          status: 'active',
          temp: Math.floor((c.temp || 40) + (Math.random() - 0.5) * 6),
          usage: Math.min(100, Math.max(5, (c.usage || 20) + (Math.random() - 0.5) * 15)),
        })));
      }, 1500);

      // Reset back to scan after some time
      const resetTimer = setTimeout(() => {
        setPhase('scan');
        setComponents([
          { id: 'cpu', label: 'CPU', status: 'scanning' },
          { id: 'gpu', label: 'GPU', status: 'scanning' },
          { id: 'ram', label: 'RAM', status: 'scanning' },
        ]);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(resetTimer);
      };
    }
  }, [phase]);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 overflow-hidden relative font-mono">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-neutral-950/80 border-b border-white/5 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <motion.div 
            className={`w-1.5 h-1.5 rounded-full ${phase === 'scan' ? 'bg-yellow-500' : 'bg-green-500'}`}
            animate={{ opacity: phase === 'scan' ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.8, repeat: phase === 'scan' ? Infinity : 0 }}
          />
          <span className="text-[9px] text-gray-500 uppercase tracking-wider">
            {phase === 'scan' ? 'Scanning Hardware' : 'System Monitor'}
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
        </div>
      </div>

      {/* Main content */}
      <div className="absolute top-7 bottom-0 left-0 right-0 p-3 flex gap-2">
        {components.map((component, index) => (
          <motion.div
            key={component.id}
            className="flex-1 bg-neutral-950/50 rounded-lg border border-white/5 p-2 flex flex-col relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
              {/* Component header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-orange-400">{component.label}</span>
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${
                    component.status === 'scanning' ? 'bg-yellow-500' :
                    component.status === 'ready' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  animate={{ 
                    scale: component.status === 'scanning' ? [1, 1.3, 1] : 1,
                    opacity: component.status === 'scanning' ? [1, 0.5, 1] : 1
                  }}
                  transition={{ duration: 0.6, repeat: component.status === 'scanning' ? Infinity : 0 }}
                />
              </div>

              {/* Scanning state */}
              {component.status === 'scanning' && (
                <motion.div 
                  className="flex-1 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}

              {/* Ready/Active state */}
              {(component.status === 'ready' || component.status === 'active') && (
                <motion.div 
                  className="flex-1 flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Temperature - only for CPU and GPU */}
                  {component.id !== 'ram' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-gray-500">TEMP</span>
                      <motion.span 
                        className={`text-[10px] font-bold ${
                          (component.temp || 0) > 70 ? 'text-red-400' :
                          (component.temp || 0) > 55 ? 'text-yellow-400' : 'text-green-400'
                        }`}
                        key={component.temp}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {component.temp}°C
                      </motion.span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-gray-500">USED</span>
                      <span className="text-[10px] font-bold text-orange-400">
                        {Math.round((component.usage || 0) * 0.32)} GB
                      </span>
                    </div>
                  )}

                  {/* Usage bar */}
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] text-gray-500">USAGE</span>
                      <span className="text-[8px] text-gray-400">{Math.round(component.usage || 0)}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          (component.usage || 0) > 80 ? 'bg-red-500' :
                          (component.usage || 0) > 50 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${component.usage || 0}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Chip icon */}
                  <div className="mt-2 flex justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-500/40">
                      <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                      {/* Pins */}
                      <line x1="8" y1="4" x2="8" y2="6" stroke="currentColor" strokeWidth="1" />
                      <line x1="12" y1="4" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
                      <line x1="16" y1="4" x2="16" y2="6" stroke="currentColor" strokeWidth="1" />
                      <line x1="8" y1="18" x2="8" y2="20" stroke="currentColor" strokeWidth="1" />
                      <line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" strokeWidth="1" />
                      <line x1="16" y1="18" x2="16" y2="20" stroke="currentColor" strokeWidth="1" />
                      <line x1="4" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1" />
                      <line x1="4" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
                      <line x1="4" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1" />
                      <line x1="18" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1" />
                      <line x1="18" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1" />
                      <line x1="18" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Pulse effect on active */}
              {component.status === 'active' && (
                <motion.div
                  className="absolute inset-0 border border-orange-500/20 rounded-lg"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
      </div>

      {/* Scan line effect during scan phase */}
      {phase === 'scan' && (
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none"
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default HardwareSkeleton;
