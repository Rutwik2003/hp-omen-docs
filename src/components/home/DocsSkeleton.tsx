import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { guides } from '../../data/guides';

const DocsSkeleton = () => {
    // Calculate total guides dynamically
    const totalGuides = guides.reduce((acc, category) => acc + category.items.length, 0);
    
    // Counting animation state
    const [displayCount, setDisplayCount] = useState(0);

    // Simulated "Live" data for the log
    const [logs, setLogs] = useState<string[]>([]);
    
    // Counting Effect
    useEffect(() => {
        let current = 0;
        const duration = 2000; // 2 seconds to count
        const steps = 60;
        const increment = totalGuides / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= totalGuides) {
                setDisplayCount(totalGuides);
                clearInterval(timer);
            } else {
                setDisplayCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [totalGuides]);

    useEffect(() => {
        const logEntries = [
            "Initializing OMEN_DOCS_CORE...",
            "Loading module: 'QuickStart_Guide'...",
            "Verifying system integrity...",
            "Graphics drivers: DETECTED",
            "Thermal profiles: SYNCHRONIZED",
            "Establishing secure connection to Hub...",
            "Downloading asset manifest (v2.4.1)...",
            "Indexing knowledge base...",
            "Optimizing search algorithms...",
            "> SYSTEM READY. Waiting for user input."
        ];

        let currentIndex = 0;
        // Variable speed typing effect
        const queueNext = () => {
             const delay = Math.random() * 800 + 400; // Random delay between 400-1200ms
             setTimeout(() => {
                 if (currentIndex < logEntries.length) {
                     setLogs(prev => [...prev.slice(-4), logEntries[currentIndex]]);
                     currentIndex++;
                     queueNext();
                 } else {
                     // Reset loop
                     setTimeout(() => {
                         setLogs([]);
                         currentIndex = 0;
                         queueNext();
                     }, 3000);
                 }
             }, delay);
        };
        
        queueNext();
        return () => {}; // Cleanup difficult with recursive timeout, relying on component unmount
    }, []);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-950 p-4 border border-white/10 overflow-hidden relative group font-mono flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_top,white,transparent)]" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-1 border-b border-white/5 pb-2 relative z-10">
         <div className="flex items-center space-x-2">
            <span className="text-cyan-500 text-xs tracking-wider font-bold">OMEN//DOCS_HUB</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800">LIVE</span>
         </div>
         <div className="text-[10px] text-gray-500">SERVER: US-EAST-1</div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex flex-col sm:flex-row flex-1 space-y-4 sm:space-y-0 sm:space-x-4 relative z-10 overflow-hidden">
          
          {/* Left Column: Metrics & Status */}
          <div className="w-full sm:w-1/3 flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-3">
              {/* Stat Card 1 */}
              <div className="flex-1 bg-white/5 rounded p-2 border border-white/5 flex flex-col justify-between group/card">
                  <span className="text-[9px] text-gray-400 uppercase">Total Guides</span>
                  <div className="flex items-end justify-between mt-1">
                      <span className="text-lg sm:text-2xl text-white font-bold tabular-nums">{displayCount}</span>
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] text-green-400"
                      >
                          ONLINE
                      </motion.span>
                  </div>
                  <div className="w-full bg-gray-800 h-0.5 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-orange-500 h-full" 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "circOut" }}
                      />
                  </div>
              </div>

               {/* Stat Card 2 */}
              <div className="flex-1 bg-white/5 rounded p-2 border border-white/5 flex flex-col justify-between">
                  <span className="text-[9px] text-gray-400 uppercase">System</span>
                  <div className="flex items-center mt-1 space-x-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-xs sm:text-sm text-green-400 font-bold">OK</span>
                  </div>
              </div>
          </div>

          {/* Right Column: Visualizer & Log */}
          <div className="w-full sm:w-2/3 flex flex-col bg-black/20 rounded-lg border border-white/5 overflow-hidden min-h-[100px]">
              {/* Top: Activity Graph Area */}
              <div className="h-1/2 border-b border-white/5 p-3 relative relative overflow-hidden">
                  <div className="absolute top-2 left-3 text-[9px] text-gray-500">NETWORK_ACTIVITY</div>
                  <div className="flex items-end justify-between h-full pt-4 space-x-1">
                      {[30, 50, 45, 70, 60, 85, 40, 65, 55, 75, 50, 90, 60, 80].map((h, i) => (
                          <motion.div
                            key={i}
                            className="bg-gradient-to-t from-cyan-500/10 to-cyan-500/50 w-full rounded-t-sm"
                            initial={{ height: "20%" }}
                            animate={{ height: [`${h}%`, `${h * 0.6}%`, `${h}%`] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                          />
                      ))}
                  </div>
              </div>

              {/* Bottom: System Log */}
              <div className="flex-1 p-3 font-mono text-[9px] overflow-hidden flex flex-col justify-end">
                  <div className="text-gray-500 mb-1 border-b border-white/5 pb-1 w-full max-w-[100px]">SYSTEM_LOG</div>
                  <div className="flex flex-col space-y-1">
                      <AnimatePresence initial={false}>
                        {logs.map((log, index) => (
                            <motion.div 
                              key={`${index}-${log}`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="text-gray-300 truncate"
                            >
                               <span className="text-cyan-600 mr-2">{`>`}</span>
                               {log}
                            </motion.div>
                        ))}
                      </AnimatePresence>
                  </div>
              </div>
          </div>

      </div>

      {/* Aesthetic Overlays */}
      <motion.div 
         className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
         animate={{ opacity: [0.3, 1, 0.3] }}
         transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
};

export default DocsSkeleton;
