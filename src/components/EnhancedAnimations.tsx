import { motion } from 'framer-motion';

interface EnhancedAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';
}

const EnhancedAnimation: React.FC<EnhancedAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  type = 'fadeIn',
}) => {
  const getInitialState = () => {
    switch (type) {
      case 'slideUp':
        return { opacity: 0, y: 30 };
      case 'slideLeft':
        return { opacity: 0, x: -30 };
      case 'slideRight':
        return { opacity: 0, x: 30 };
      case 'scaleIn':
        return { opacity: 0, scale: 0.8 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialState()}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }
      }
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
);

export default EnhancedAnimation;
