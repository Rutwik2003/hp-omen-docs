import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WindowsSkeleton = () => {
  const [mode, setMode] = useState<'boot' | 'game' | 'interactive'>('boot');
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Game State Refs (for performance)
  const gameState = useRef({
    ball: { x: 50, y: 50, dx: 0, dy: 0, speed: 0.8 },
    p1: { y: 50 }, // Player (Left)
    p2: { y: 50 }, // AI (Right)
    isPlaying: false,
    lastInteraction: 0,
    aiOffset: 0, // Randomness for AI error
    aiUpdateTimer: 0,
    resetTimer: 0 // New: Pause before serving
  });
  
  const [, forceUpdate] = useState(0); // Force re-render for game loop updates

  // Switch to game mode after "booting"
  useEffect(() => {
    if (mode === 'boot') {
      const timer = setTimeout(() => {
        setMode('game');
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Simulated Score (Auto Mode)
  useEffect(() => {
     if (mode === 'game') {
         const intervals = [
             setTimeout(() => setScore(s => ({ ...s, p1: 1 })), 2500),
             setTimeout(() => setScore(s => ({ ...s, p2: 1 })), 5500),
             setTimeout(() => setScore(s => ({ ...s, p1: 2 })), 8500),
         ];
         return () => intervals.forEach(clearTimeout);
     }
  }, [mode]);

  // Game Loop (Interactive Mode)
  useEffect(() => {
    if (mode !== 'interactive') return;

    let animationFrameId: number;
    const state = gameState.current;
    state.isPlaying = true;
    state.lastInteraction = Date.now(); // Reset timer on start

    // Reset game state on enter
    state.p1.y = 50;
    state.p2.y = 50;
    state.aiOffset = 0;
    state.resetTimer = 60; // Start with a delay
    state.ball = { x: 50, y: 50, dx: 0, dy: 0, speed: 0.6 }; // Start stationary
    setScore({ p1: 0, p2: 0 });

    const updateGame = () => {
      if (!state.isPlaying) return;

      // Idle Detection (5 seconds)
      if (Date.now() - state.lastInteraction > 5000) {
          setMode('game'); // Revert to auto mode
          return;
      }

      // Handle Reset/Serve Delay
      if (state.resetTimer > 0) {
          state.resetTimer--;
          if (state.resetTimer === 0) {
             // SERVE!
             const dir = Math.random() > 0.5 ? 1 : -1;
             state.ball = { 
                 x: 50, 
                 y: 50, 
                 dx: dir * 0.6, // Slow start speed
                 dy: (Math.random() - 0.5) * 1.5, 
                 speed: 0.6 
             };
          }
          // While resetting, ball stays in center
          if (state.ball.dx !== 0) {
             // If we just finished resetting, dx is set, so we don't zero it.
             // But if we are IN reset (timer > 0), ensure it stays put? 
             // Logic above sets ball to moving ONLY when timer hits 0.
             // So if timer > 0, we just return/render to show stationary ball?
             // Actually let's just render the stationary ball at 50,50
             state.ball.x = 50;
             state.ball.y = 50;
          }
          forceUpdate(prev => prev + 1);
          animationFrameId = requestAnimationFrame(updateGame);
          return;
      }

      // Ball Movement
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall Collisions (Top/Bottom)
      if (state.ball.y <= 0 || state.ball.y >= 100) {
        state.ball.dy *= -1;
      }

      // AI Logic (Right Paddle) - Easier
      // 1. Only move if ball is moving towards AI (dx > 0)
      // 2. Only move if ball is past center line (x > 50) - gives human more time
      if (state.ball.dx > 0 && state.ball.x > 30) {
          state.aiUpdateTimer++;
          if (state.aiUpdateTimer > 20) {
              state.aiOffset = (Math.random() - 0.5) * 25; // Massive error margin (+/- 12.5%)
              state.aiUpdateTimer = 0;
          }
          
          const aiTarget = state.ball.y + state.aiOffset;
          // Speed limit: AI moves slightly slower than ball's typical vertical speed
          // Ball Dy is usually < 1.0. AI Speed 0.6 means it might miss fast diagonal shots.
          const aiSpeed = 0.8; 
          
          if (state.p2.y < aiTarget - 2) state.p2.y += aiSpeed;
          if (state.p2.y > aiTarget + 2) state.p2.y -= aiSpeed;
      }
      state.p2.y = Math.max(10, Math.min(90, state.p2.y));

      // Paddle Collisions
      const paddleHit = (isPlayer: boolean) => {
          // Increase speed slightly, but CAP IT
          const currentSpeed = Math.abs(state.ball.dx);
          const newSpeed = Math.min(currentSpeed * 1.05, 1.5); // Max speed cap 1.5
          
          state.ball.dx = (isPlayer ? 1 : -1) * newSpeed;
          state.ball.x = isPlayer ? 5 : 95;
          // Add spin
          state.ball.dy += (state.ball.y - (isPlayer ? state.p1.y : state.p2.y)) * 0.1;
      };

      // Player (Left)
      if (state.ball.dx < 0 && state.ball.x <= 5 && Math.abs(state.ball.y - state.p1.y) < 15) {
        paddleHit(true);
      }
      
      // AI (Right)
      if (state.ball.dx > 0 && state.ball.x >= 95 && Math.abs(state.ball.y - state.p2.y) < 15) {
        paddleHit(false);
      } 
      
      // Scoring
      if (state.ball.x < 0) {
        setScore(s => ({ ...s, p2: s.p2 + 1 }));
        state.resetTimer = 60; // 1 second delay
      } else if (state.ball.x > 100) {
        setScore(s => ({ ...s, p1: s.p1 + 1 }));
        state.resetTimer = 60; // 1 second delay
      }

      forceUpdate(prev => prev + 1); // Trigger render
      animationFrameId = requestAnimationFrame(updateGame);
    };

    animationFrameId = requestAnimationFrame(updateGame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      state.isPlaying = false;
    };
  }, [mode]);

  // Mouse Handler for Player Paddle
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode !== 'interactive' || !containerRef.current) return;
    
    gameState.current.lastInteraction = Date.now(); // Update idle timer
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
    
    gameState.current.p1.y = Math.max(10, Math.min(90, relativeY));
  }, [mode]);

  const startInteractive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMode('interactive');
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 p-4 border border-white/10 overflow-hidden relative flex items-center justify-center group ${mode === 'interactive' ? 'cursor-none' : ''}`}
      onMouseMove={handleMouseMove}
      onClick={(e) => mode === 'interactive' && e.preventDefault()} // Prevent nav in game
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <AnimatePresence mode="wait">
        {mode === 'boot' ? (
           <motion.div
             key="boot"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
             transition={{ duration: 0.5 }}
             className="relative z-10 w-full h-full flex items-center justify-center"
           >
              {/* Original Holographic Ring Boot Sequence */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 border-2 border-cyan-500/30 rounded-full border-t-cyan-400 border-r-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 border border-blue-500/20 rounded-full border-b-blue-400 border-l-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-2xl font-bold text-cyan-400 font-mono"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    SYS
                  </motion.span>
                  <span className="text-[10px] text-cyan-500/70 tracking-widest">ONLINE</span>
                </div>
              </div>
           </motion.div>
        ) : (
           <motion.div
             key="game"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative z-10 w-full h-full flex flex-col"
           >
              {/* Game Header / Score */}
              <div className="absolute top-0 inset-x-0 flex justify-center space-x-8 pt-2 font-mono text-xs font-bold text-white/20">
                  <div className={`transition-colors duration-300 ${score.p1 > score.p2 ? 'text-cyan-400' : ''}`}>PY_1: {score.p1}</div>
                  <div className={`transition-colors duration-300 ${score.p2 > score.p1 ? 'text-orange-400' : ''}`}>PY_2: {score.p2}</div>
              </div>

              {/* Game Board */}
              <div className="flex-1 relative w-full h-full min-h-[120px] overflow-hidden">
                  {/* Center Line */}
                  <div className="absolute top-2 bottom-2 left-1/2 w-px bg-white/5 border-r border-dashed border-white/10 -translate-x-1/2" />
                  
                  {mode === 'interactive' ? (
                    // Interactive Game Elements
                    <>
                        {/* Player Paddle */}
                        <div 
                            className="absolute left-2 sm:left-4 w-1.5 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ 
                                top: `${gameState.current.p1.y}%`,
                                transform: 'translateY(-50%)'
                            }}
                        />
                        {/* AI Paddle */}
                        <div 
                            className="absolute right-2 sm:right-4 w-1.5 h-8 bg-orange-500 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                            style={{ 
                                top: `${gameState.current.p2.y}%`,
                                transform: 'translateY(-50%)'
                            }}
                        />
                        {/* Ball */}
                        <div 
                            className="absolute w-2 h-2 bg-white rounded-full shadow-lg"
                            style={{ 
                                left: `${gameState.current.ball.x}%`,
                                top: `${gameState.current.ball.y}%`,
                                transform: 'translate(-50%, -50%)' 
                            }}
                        />
                    </>
                  ) : (
                    // Auto-Play Animations (Preserved Original)
                    <>
                      <motion.div 
                        className="absolute left-2 sm:left-4 top-1/2 w-1.5 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        animate={{ y: ["-50%", "-120%", "40%", "-50%", "80%", "-50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.7, 0.9, 1] }}
                      />
                      <motion.div 
                        className="absolute right-2 sm:right-4 top-1/2 w-1.5 h-8 bg-orange-500 rounded-sm shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        animate={{ y: ["-50%", "60%", "-100%", "20%", "-50%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.6, 0.8, 1] }}
                      />
                      <motion.div 
                        className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                        initial={{ left: "50%", y: "-50%" }}
                        animate={{ left: ["5%", "95%", "5%"], top: ["50%", "80%", "20%", "50%"] }}
                        transition={{ left: { duration: 2, repeat: Infinity, ease: "linear" }, top: { duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "mirror" } }}
                        style={{ x: "-50%", y: "-50%" }}
                      />
                    </>
                  )}
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Widgets & Interactive Button */}
      <div className="absolute bottom-2 right-3 z-20 flex items-center space-x-2">
        {mode === 'game' && (
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startInteractive}
                className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-[8px] font-mono text-cyan-400 transition-colors uppercase cursor-pointer"
            >
                Initialize Link
            </motion.button>
        )}
        
        <motion.div 
          className="flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[8px] text-gray-600 font-mono">
              {mode === 'boot' ? 'BOOTING...' : mode === 'interactive' ? 'MANUAL_OVERRIDE' : 'GAME_ENGINE_ACTIVE'}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${mode !== 'boot' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
        </motion.div>
      </div>
    </div>
  );
};

export default WindowsSkeleton;
