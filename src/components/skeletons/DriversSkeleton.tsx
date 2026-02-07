import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const drivers = [
    { name: "HP Support Assistant", size: "128MB", color: "bg-blue-500" },
    { name: "NVIDIA GeForce Driver", size: "645MB", color: "bg-green-500" },
    { name: "OMEN Gaming Hub SDK", size: "128MB", color: "bg-orange-500" },
    { name: "Realtek Audio Control", size: "45MB", color: "bg-blue-500" },
    { name: "Discord", size: "110MB", color: "bg-indigo-500" },
    { name: "Steam", size: "25MB", color: "bg-blue-700" },
    { name: "Epic Games Launcher", size: "165MB", color: "bg-slate-500" }
];

const DriversSkeleton = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<'downloading' | 'verifying' | 'installing' | 'completed'>('downloading');
    const [progress, setProgress] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState("0 MB/s"); // Cosmetic

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        
        if (status === 'downloading') {
            // Simulate download progress
            setProgress(0);
            const duration = 2000; 
            const steps = 30;
            let currentStep = 0;
            
            interval = setInterval(() => {
                currentStep++;
                const newProgress = (currentStep / steps) * 100;
                setProgress(newProgress);
                
                // Randomize speed text for realism
                setDownloadSpeed(`${Math.floor(Math.random() * 40 + 20)} MB/s`);

                if (currentStep >= steps) {
                    clearInterval(interval);
                    setStatus('verifying'); // New Step
                }
            }, duration / steps);
            
        } else if (status === 'verifying') {
             // Short pause for "verifying"
             const timer = setTimeout(() => {
                 setStatus('installing');
             }, 800);
             return () => clearTimeout(timer);

        } else if (status === 'installing') {
            // Wait for "install" animation
            const timer = setTimeout(() => {
                setStatus('completed');
            }, 1500);
            return () => clearTimeout(timer);
            
        } else if (status === 'completed') {
            // Wait then move to next driver
            const timer = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % drivers.length);
                setStatus('downloading');
            }, 1500);
            return () => clearTimeout(timer);
        }

        return () => {
             if (interval) clearInterval(interval);
        };
    }, [status, currentIndex]);

    const currentDriver = drivers[currentIndex];

    const windowSize = 3;
    let startIdx = currentIndex - 1;
    if (startIdx < 0) startIdx = 0;
    if (startIdx > drivers.length - windowSize) startIdx = drivers.length - windowSize;
    
    // Improved sliding window logic
    // We want the current item to essentially scroll up.
    // Simpler approach: Just slice 3 items around the current index
    const visibleDrivers = drivers.slice(startIdx, startIdx + windowSize).map((d, i) => ({
        ...d,
        originalIndex: startIdx + i
    }));

  return (
    <div className="flex flex-1 w-full h-full min-h-[12rem] sm:min-h-[10rem] md:min-h-[6rem] rounded-xl bg-neutral-900 p-3 sm:p-4 border border-white/10 overflow-hidden relative flex flex-col justify-between font-mono group">
       {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_top_right,white,transparent)]" />
      
      <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-2 mb-2">
           <div className="text-[11px] sm:text-[10px] text-gray-500">DRIVER_MANAGER_V4.0</div>
           <div className="flex space-x-1">
               <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500/50" />
               <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-500/50" />
               <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500/50" />
           </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 space-y-4">
          <AnimatePresence mode="wait">
              <motion.div
                key={currentDriver.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                  <div className="flex justify-between text-xs sm:text-[11px] text-gray-300 font-bold">
                      <span className="truncate pr-2">{currentDriver.name}</span>
                      <span className="text-gray-500 text-[10px] sm:text-[9px]">{currentDriver.size}</span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-2.5 sm:h-2 w-full bg-gray-800 rounded-full overflow-hidden relative group-hover:bg-gray-700 transition-colors">
                      {status === 'installing' || status === 'verifying' ? (
                          <div className={`h-full w-full ${currentDriver.color} opacity-80 relative overflow-hidden`}>
                               {/* Smooth shimmer effect moving right */}
                               <motion.div 
                                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                 initial={{ x: '-100%' }}
                                 animate={{ x: '100%' }}
                                 transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                               />
                          </div>
                      ) : status === 'completed' ? (
                          <motion.div 
                             className="h-full bg-green-400"
                             initial={{ width: "100%" }}
                          />
                      ) : (
                          <motion.div 
                             className={`h-full ${currentDriver.color}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${progress}%` }}
                          />
                      )}
                  </div>

                  {/* Status Text */}
                  <div className="flex justify-between items-center text-[11px] sm:text-[10px] h-4">
                      <motion.span 
                         key={status}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className={
                             status === 'completed' ? 'text-green-400' :
                             status === 'installing' ? 'text-yellow-400' :
                             status === 'verifying' ? 'text-blue-400' :
                             'text-gray-500'
                         }
                      >
                          {status === 'downloading' && `DOWNLOADING... ${downloadSpeed}`}
                          {status === 'verifying' && `VERIFYING INTEGRITY...`}
                          {status === 'installing' && `INSTALLING...`}
                          {status === 'completed' && `SUCCESSFULLY INSTALLED`}
                      </motion.span>
                      
                      {status === 'downloading' && (
                          <span className="text-gray-600 animate-pulse">▼</span>
                      )}
                      {(status === 'installing' || status === 'verifying') && (
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="text-gray-600 block"
                          >
                              ⟳
                          </motion.span>
                      )}
                  </div>
              </motion.div>
          </AnimatePresence>
      </div>

      {/* Queue Preview (Sliding Window) */}
      <div className="mt-2 pt-2 border-t border-white/5 flex flex-col space-y-1.5 sm:space-y-1 opacity-50 min-h-[50px]">
          {visibleDrivers.map((d) => (
              <div key={d.name} className={`flex items-center space-x-2 text-[10px] sm:text-[9px] ${d.originalIndex === currentIndex ? 'text-white font-bold' : 'text-gray-600'}`}>
                   <div className={`w-1.5 h-1.5 sm:w-1 sm:h-1 rounded-full ${d.originalIndex < currentIndex ? 'bg-green-500' : d.originalIndex === currentIndex ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'}`} />
                   <span className="truncate max-w-[180px] sm:max-w-[150px]">{d.name}</span>
              </div>
          ))}
          {/* Indicator that there are more items */}
          <div className="h-0.5 bg-white/5 rounded w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export default DriversSkeleton;
