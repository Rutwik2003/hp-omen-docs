import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = "", 
  spotlightColor = "rgba(255, 107, 53, 0.15)" // Default OMEN orange transparency
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useGSAP(() => {
    xTo.current = gsap.quickTo(spotlightRef.current, "x", { duration: 0.1, ease: "power3" });
    yTo.current = gsap.quickTo(spotlightRef.current, "y", { duration: 0.1, ease: "power3" });
    ctxRef.current = gsap.context(() => {}, divRef.current!);
  }, { scope: divRef });

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !xTo.current || !yTo.current) return;
    
    const rect = divRef.current.getBoundingClientRect();
    xTo.current(clientX - rect.left);
    yTo.current(clientY - rect.top);
  };

  const handleMouseEnter = () => {
    ctxRef.current?.add(() => {
      gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3 });
    });
  };

  const handleMouseLeave = () => {
    ctxRef.current?.add(() => {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/50 p-6 shadow-lg transition-all duration-300 hover:border-orange-500/30 ${className}`}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at center, ${spotlightColor}, transparent 40%)`,
          transform: 'translate(-50%, -50%)', 
          left: 0, 
          top: 0
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
