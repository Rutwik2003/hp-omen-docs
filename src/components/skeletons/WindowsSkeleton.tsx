import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type GameMode = 'boot' | 'game' | 'interactive';

// AI difficulty profiles
const AI_PROFILES = [
  { name: 'Sleepy', reactAt: 80, speed: 0.25, errorRange: 70, deadZone: 8, hitbox: 10 },
  { name: 'Casual', reactAt: 70, speed: 0.4, errorRange: 50, deadZone: 5, hitbox: 12 },
  { name: 'Normal', reactAt: 60, speed: 0.55, errorRange: 35, deadZone: 4, hitbox: 14 },
  { name: 'Focused', reactAt: 50, speed: 0.7, errorRange: 20, deadZone: 3, hitbox: 15 },
  { name: 'Pro', reactAt: 40, speed: 0.85, errorRange: 10, deadZone: 2, hitbox: 16 },
];

const WindowsSkeleton = () => {
  const [mode, setMode] = useState<GameMode>('boot');
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [bootPhase, setBootPhase] = useState(0);
  const [idleWarning, setIdleWarning] = useState(false);
  const [exitMessage, setExitMessage] = useState(false);
  const [aiProfile, setAiProfile] = useState(AI_PROFILES[1]); // Default to Casual
  const aiProfileRef = useRef(AI_PROFILES[1]); // Ref for game loop to read current profile
  const containerRef = useRef<HTMLDivElement>(null);
  const preserveStateOnExit = useRef(false);

  // Game State Refs (for performance)
  const gameState = useRef({
    ball: { x: 50, y: 50, dx: 0, dy: 0, speed: 0.8 },
    p1: { y: 50 }, // Player (Left)
    p2: { y: 50 }, // AI (Right)
    isPlaying: false,
    lastInteraction: 0,
    aiOffset: 0, // Randomness for AI error
    aiUpdateTimer: 0,
    resetTimer: 0, // Pause before serving
    trail: [] as { x: number; y: number }[] // Ball trail
  });
  
  const [, forceUpdate] = useState(0); // Force re-render for game loop updates

  // Boot sequence phases
  useEffect(() => {
    if (mode === 'boot') {
      const phases = [
        setTimeout(() => setBootPhase(1), 400),
        setTimeout(() => setBootPhase(2), 1000),
        setTimeout(() => setBootPhase(3), 1800),
        setTimeout(() => setBootPhase(4), 2400),
        setTimeout(() => {
          setMode('game');
        }, 3200),
      ];
      return () => phases.forEach(clearTimeout);
    }
  }, [mode]);

  // Simulated Score (Auto Mode) - removed, now handled by physics loop

  // Auto-play physics loop
  useEffect(() => {
    if (mode !== 'game') return;

    let animationFrameId: number;
    const state = gameState.current;
    
    // Only reset if not preserving state from interactive mode
    if (!preserveStateOnExit.current) {
      state.ball = { x: 50, y: 50, dx: 0.4, dy: 0.3, speed: 0.4 };
      state.p1.y = 50;
      state.p2.y = 50;
    } else {
      // Coming from interactive - ensure ball has valid velocity for auto-play
      if (Math.abs(state.ball.dx) < 0.3) {
        state.ball.dx = state.ball.dx >= 0 ? 0.4 : -0.4;
      }
      preserveStateOnExit.current = false;
    }

    const updateAutoPlay = () => {
      // Ball Movement
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall Collisions (Top/Bottom) - instant bounce
      if (state.ball.y <= 5) {
        state.ball.y = 5;
        state.ball.dy = Math.abs(state.ball.dy);
      }
      if (state.ball.y >= 95) {
        state.ball.y = 95;
        state.ball.dy = -Math.abs(state.ball.dy);
      }

      // AI for both paddles - track ball with slight delay
      const p1Target = state.ball.y;
      const p2Target = state.ball.y;
      
      // Left paddle tracks when ball coming left
      if (state.ball.dx < 0) {
        if (state.p1.y < p1Target - 1) state.p1.y += 0.5;
        if (state.p1.y > p1Target + 1) state.p1.y -= 0.5;
      }
      
      // Right paddle tracks when ball coming right
      if (state.ball.dx > 0) {
        if (state.p2.y < p2Target - 1) state.p2.y += 0.5;
        if (state.p2.y > p2Target + 1) state.p2.y -= 0.5;
      }
      
      state.p1.y = Math.max(15, Math.min(85, state.p1.y));
      state.p2.y = Math.max(15, Math.min(85, state.p2.y));

      // Paddle collisions
      if (state.ball.x <= 8 && state.ball.dx < 0) {
        if (Math.abs(state.ball.y - state.p1.y) < 12) {
          state.ball.dx = Math.abs(state.ball.dx);
          state.ball.x = 8;
          // Add angle based on where ball hits paddle
          state.ball.dy += (state.ball.y - state.p1.y) * 0.03;
        }
      }
      
      if (state.ball.x >= 92 && state.ball.dx > 0) {
        if (Math.abs(state.ball.y - state.p2.y) < 12) {
          state.ball.dx = -Math.abs(state.ball.dx);
          state.ball.x = 92;
          state.ball.dy += (state.ball.y - state.p2.y) * 0.03;
        }
      }

      // Reset if ball goes off screen (shouldn't happen with AI)
      if (state.ball.x < 0 || state.ball.x > 100) {
        state.ball = { x: 50, y: 50, dx: state.ball.x < 0 ? 0.4 : -0.4, dy: (Math.random() - 0.5) * 0.5, speed: 0.4 };
      }

      // Clamp dy to prevent crazy angles
      state.ball.dy = Math.max(-0.6, Math.min(0.6, state.ball.dy));

      forceUpdate(prev => prev + 1);
      animationFrameId = requestAnimationFrame(updateAutoPlay);
    };

    animationFrameId = requestAnimationFrame(updateAutoPlay);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  // Game Loop (Interactive Mode)
  useEffect(() => {
    if (mode !== 'interactive') return;

    let animationFrameId: number;
    const state = gameState.current;
    state.isPlaying = true;
    state.lastInteraction = Date.now();
    state.trail = [];

    // Reset game state on enter
    state.p1.y = 50;
    state.p2.y = 50;
    state.aiOffset = 0;
    state.resetTimer = 60;
    state.ball = { x: 50, y: 50, dx: 0, dy: 0, speed: 0.6 };
    setScore({ p1: 0, p2: 0 });
    setIdleWarning(false);
    setExitMessage(false);
    
    // Randomly select AI difficulty profile
    const randomProfile = AI_PROFILES[Math.floor(Math.random() * AI_PROFILES.length)];
    setAiProfile(randomProfile);
    aiProfileRef.current = randomProfile;

    const updateGame = () => {
      if (!state.isPlaying) return;

      const idleTime = Date.now() - state.lastInteraction;
      
      // Show warning at 3 seconds
      if (idleTime > 3000 && idleTime <= 5000) {
        setIdleWarning(true);
      } else {
        setIdleWarning(false);
      }

      // Smooth exit at 5 seconds - preserve state and transition
      if (idleTime > 5000) {
          preserveStateOnExit.current = true;
          setExitMessage(true);
          // Brief delay to show message, then switch
          setTimeout(() => {
            setMode('game');
            setExitMessage(false);
            setIdleWarning(false);
          }, 800);
          return;
      }

      // Handle Reset/Serve Delay
      if (state.resetTimer > 0) {
          state.resetTimer--;
          if (state.resetTimer === 0) {
             const dir = Math.random() > 0.5 ? 1 : -1;
             state.ball = { 
                 x: 50, 
                 y: 50, 
                 dx: dir * 0.5,
                 dy: (Math.random() - 0.5) * 0.4, 
                 speed: 0.5 
             };
             state.trail = [];
          }
          if (state.ball.dx !== 0) {
             state.ball.x = 50;
             state.ball.y = 50;
          }
          forceUpdate(prev => prev + 1);
          animationFrameId = requestAnimationFrame(updateGame);
          return;
      }

      // Update trail
      state.trail.push({ x: state.ball.x, y: state.ball.y });
      if (state.trail.length > 8) state.trail.shift();

      // Ball Movement
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall Collisions (Top/Bottom)
      if (state.ball.y <= 5 || state.ball.y >= 95) {
        state.ball.dy *= -1;
        state.ball.y = Math.max(5, Math.min(95, state.ball.y));
      }
      
      // Clamp dy to prevent crazy angles
      state.ball.dy = Math.max(-0.4, Math.min(0.4, state.ball.dy));

      // AI Logic (Right Paddle) - Uses random difficulty profile
      const profile = aiProfileRef.current;
      if (state.ball.dx > 0 && state.ball.x > profile.reactAt) {
          state.aiUpdateTimer++;
          if (state.aiUpdateTimer > 12) {
              state.aiOffset = (Math.random() - 0.5) * profile.errorRange;
              state.aiUpdateTimer = 0;
          }
          
          const aiTarget = state.ball.y + state.aiOffset;
          
          if (state.p2.y < aiTarget - profile.deadZone) state.p2.y += profile.speed;
          if (state.p2.y > aiTarget + profile.deadZone) state.p2.y -= profile.speed;
      }
      state.p2.y = Math.max(15, Math.min(85, state.p2.y));

      // Paddle Collisions
      const paddleHit = (isPlayer: boolean) => {
          const currentSpeed = Math.abs(state.ball.dx);
          const newSpeed = Math.min(currentSpeed * 1.02, 1.0);
          
          state.ball.dx = (isPlayer ? 1 : -1) * newSpeed;
          state.ball.x = isPlayer ? 5 : 95;
          // Reduced angle modifier to prevent crazy bounces
          state.ball.dy += (state.ball.y - (isPlayer ? state.p1.y : state.p2.y)) * 0.03;
          // Clamp dy immediately after paddle hit
          state.ball.dy = Math.max(-0.4, Math.min(0.4, state.ball.dy));
      };

      // Player (Left) - Larger hitbox for player
      if (state.ball.dx < 0 && state.ball.x <= 8 && Math.abs(state.ball.y - state.p1.y) < 18) {
        paddleHit(true);
      }
      
      // AI (Right) - Hitbox based on AI profile
      if (state.ball.dx > 0 && state.ball.x >= 95 && Math.abs(state.ball.y - state.p2.y) < profile.hitbox) {
        paddleHit(false);
      } 
      
      // Scoring
      if (state.ball.x < 0) {
        setScore(s => ({ ...s, p2: s.p2 + 1 }));
        state.resetTimer = 60;
        state.trail = [];
      } else if (state.ball.x > 100) {
        setScore(s => ({ ...s, p1: s.p1 + 1 }));
        state.resetTimer = 60;
        state.trail = [];
      }

      forceUpdate(prev => prev + 1);
      animationFrameId = requestAnimationFrame(updateGame);
    };

    animationFrameId = requestAnimationFrame(updateGame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      state.isPlaying = false;
    };
  }, [mode]);

  // Document-level mouse tracking for interactive mode
  // This ensures paddle follows even when cursor goes outside the container
  useEffect(() => {
    if (mode !== 'interactive') return;
    
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      gameState.current.lastInteraction = Date.now();
      setIdleWarning(false);
      
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      
      gameState.current.p1.y = Math.max(10, Math.min(90, relativeY));
    };
    
    const handleDocumentTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      
      gameState.current.lastInteraction = Date.now();
      setIdleWarning(false);
      
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = ((touch.clientY - rect.top) / rect.height) * 100;
      
      gameState.current.p1.y = Math.max(10, Math.min(90, relativeY));
    };
    
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('touchmove', handleDocumentTouchMove);
    
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
    };
  }, [mode]);

  // Mouse Handler for Player Paddle (fallback for container events)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode !== 'interactive' || !containerRef.current) return;
    
    gameState.current.lastInteraction = Date.now();
    setIdleWarning(false);
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
    
    gameState.current.p1.y = Math.max(10, Math.min(90, relativeY));
  }, [mode]);

  // Touch Handler for Mobile (fallback for container events)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (mode !== 'interactive' || !containerRef.current) return;
    
    gameState.current.lastInteraction = Date.now();
    setIdleWarning(false);
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = ((touch.clientY - rect.top) / rect.height) * 100;
    
    gameState.current.p1.y = Math.max(10, Math.min(90, relativeY));
  }, [mode]);

  const startInteractive = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMode('interactive');
  };

  const bootMessages = [
    'Initializing kernel...',
    'Loading drivers...',
    'Starting services...',
    'System ready'
  ];

  return (
    <div 
      ref={containerRef}
      className={`flex flex-1 w-full h-full min-h-[10rem] sm:min-h-[8rem] rounded-xl bg-neutral-950 border border-white/10 overflow-hidden relative font-mono ${mode === 'interactive' ? 'cursor-none' : ''}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => mode === 'interactive' && e.preventDefault()}
    >


      <AnimatePresence mode="wait">
        {mode === 'boot' ? (
           <motion.div
             key="boot"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, filter: "blur(10px)" }}
             transition={{ duration: 0.3 }}
             className="absolute inset-0 flex flex-col p-3 sm:p-4"
           >
              {/* Boot header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-cyan-500 rounded-sm"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <span className="text-[9px] sm:text-[10px] text-cyan-400/80 uppercase tracking-widest">System Boot</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                </div>
              </div>

              {/* Boot terminal */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1 sm:space-y-1.5">
                  {bootMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: bootPhase > i ? 1 : 0,
                        x: bootPhase > i ? 0 : -10
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className={`w-1.5 h-1.5 rounded-full ${
                          bootPhase > i ? (i === 3 ? 'bg-green-500' : 'bg-cyan-500') : 'bg-gray-600'
                        }`}
                        animate={bootPhase > i && i < 3 ? { opacity: [1, 0.5, 1] } : {}}
                        transition={{ duration: 0.3, repeat: bootPhase === i + 1 ? Infinity : 0 }}
                      />
                      <span className={`text-[9px] sm:text-[10px] ${
                        bootPhase > i ? (i === 3 ? 'text-green-400' : 'text-cyan-400/80') : 'text-gray-600'
                      }`}>
                        {msg}
                      </span>
                      {bootPhase === i + 1 && i < 3 && (
                        <motion.span
                          className="text-[9px] sm:text-[10px] text-cyan-400/50"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          _
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-3 sm:mt-4 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(bootPhase / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
           </motion.div>
        ) : (
           <motion.div
             key="game"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 flex flex-col"
           >
              {/* Game Header */}
              <div className="h-7 bg-neutral-900/80 border-b border-white/5 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${mode === 'interactive' ? 'bg-cyan-500' : 'bg-green-500'}`} />
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                    {mode === 'interactive' ? `vs ${aiProfile.name}` : 'Auto Mode'}
                  </span>
                </div>
                
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-cyan-500 rounded-sm" />
                    <span className={`text-xs font-bold transition-colors ${score.p1 >= score.p2 ? 'text-cyan-400' : 'text-gray-500'}`}>
                      {score.p1}
                    </span>
                  </div>
                  <span className="text-[8px] text-gray-600">VS</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold transition-colors ${score.p2 > score.p1 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {score.p2}
                    </span>
                    <div className="w-2 h-2 bg-orange-500 rounded-sm" />
                  </div>
                </div>

                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                </div>
              </div>

              {/* Game Board */}
              <div className="flex-1 relative overflow-hidden bg-neutral-950">
                  {/* Center Line - simple dashed */}
                  <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-white/10" />
                  
                  {/* Idle Warning Overlay */}
                  <AnimatePresence>
                    {idleWarning && mode === 'interactive' && !exitMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                      >
                        <motion.div 
                          className="bg-neutral-900/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-yellow-500/30"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <p className="text-[10px] sm:text-xs text-yellow-400">Move to continue playing...</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Player Paddle */}
                  <div 
                      className="absolute left-2 w-1 h-8 bg-cyan-600 rounded-sm"
                      style={{ 
                          top: `${gameState.current.p1.y}%`,
                          transform: 'translateY(-50%)'
                      }}
                  />
                  {/* AI Paddle */}
                  <div 
                      className="absolute right-2 w-1 h-8 bg-orange-600 rounded-sm"
                      style={{ 
                          top: `${gameState.current.p2.y}%`,
                          transform: 'translateY(-50%)'
                      }}
                  />
                  {/* Ball */}
                  <div 
                      className="absolute w-1.5 h-1.5 bg-white rounded-full"
                      style={{ 
                          left: `${gameState.current.ball.x}%`,
                          top: `${gameState.current.ball.y}%`,
                          transform: 'translate(-50%, -50%)'
                      }}
                  />
              </div>

              {/* Footer */}
              <div className="h-6 bg-neutral-900/80 border-t border-white/5 flex items-center justify-between px-3">
                {mode === 'game' && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startInteractive}
                        onTouchEnd={startInteractive}
                        className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-cyan-500/30 rounded text-[8px] text-cyan-400 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                        Play
                    </motion.button>
                )}
                {mode === 'interactive' && !exitMessage && (
                  <span className="text-[8px] text-gray-400">
                    <span className="hidden sm:inline">Move mouse to control</span>
                    <span className="sm:hidden">Touch & drag</span>
                    <span className="text-yellow-400/60"> • 5s idle to exit</span>
                  </span>
                )}
                {exitMessage && (
                  <motion.span 
                    className="text-[8px] text-yellow-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Returning to Auto Mode...
                  </motion.span>
                )}
                <span className="text-[8px] text-gray-600 ml-auto">60 FPS</span>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindowsSkeleton;
