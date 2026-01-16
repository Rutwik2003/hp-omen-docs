
import { motion } from 'framer-motion';

export const AnimatedWrench = ({ className = "w-6 h-6 text-current" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
        whileHover="hover"
      >
        <motion.path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
          variants={{
            hover: {
              rotate: [0, -10, 10, -10, 0],
              transition: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }
          }}
        />
      </motion.svg>
    </div>
  );
};
