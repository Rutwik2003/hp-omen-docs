import React, { useRef } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

// Page transition variants for smooth crossfade
const pageVariants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

// Freeze children only during exit animation so the exiting page
// doesn't flash new content. During enter/visible phase, allow
// normal React updates (Suspense resolution, data loading, etc.)
const FrozenRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isPresent = useIsPresent();
  const frozenRef = useRef(children);

  // While the component is present (entering or visible), keep updating
  if (isPresent) {
    frozenRef.current = children;
  }
  // When exiting (isPresent = false), render the last snapshot
  return <>{frozenRef.current}</>;
};

const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedLayout;
