import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCheck, AnimatedShield, AnimatedZap } from '../animated-icons';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';

interface InfoBoxProps {
  type: 'info' | 'warning' | 'success' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type, title, children }) => {
  const styles = {
    info: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/10',
      text: 'text-blue-400',
      iconBg: 'from-blue-500/20 to-blue-600/10',
      icon: Info
    },
    warning: {
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/10',
      text: 'text-amber-400',
      iconBg: 'from-amber-500/20 to-amber-600/10',
      icon: AlertTriangle
    },
    success: {
       bg: 'from-green-500/10 to-green-600/5',
       border: 'border-green-500/30',
       glow: 'shadow-green-500/10',
       text: 'text-green-400',
       iconBg: 'from-green-500/20 to-green-600/10',
       icon: AnimatedCheck
    },
    tip: {
       bg: 'from-purple-500/10 to-purple-600/5',
       border: 'border-purple-500/30',
       glow: 'shadow-purple-500/10',
       text: 'text-purple-400',
       iconBg: 'from-purple-500/20 to-purple-600/10',
       icon: Lightbulb
    },
    danger: {
        bg: 'from-red-500/10 to-red-600/5',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/10',
        text: 'text-red-400',
        iconBg: 'from-red-500/20 to-red-600/10',
        icon: AlertCircle
    }
  };

  const currentStyle = styles[type];
  const Icon = currentStyle.icon;

  return (
    <motion.div 
      className={`relative overflow-hidden bg-gradient-to-br ${currentStyle.bg} ${currentStyle.border} border rounded-xl p-4 sm:p-5 md:p-6 my-4 shadow-lg ${currentStyle.glow} backdrop-blur-sm`}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative gradient accent */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${currentStyle.iconBg.replace('from-', 'from-').replace('/20', '').replace('/10', '')} opacity-80`} />
      
      {/* Decorative corner glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl ${currentStyle.iconBg} rounded-full blur-2xl opacity-40 pointer-events-none`} />
      
      <div className="flex items-start gap-3 sm:gap-4 relative z-10">
        {/* Icon with gradient background */}
        <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${currentStyle.iconBg} flex items-center justify-center border ${currentStyle.border}`}>
           <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentStyle.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm sm:text-base font-bold ${currentStyle.text} mb-2`}>
              {title}
            </h4>
          )}
          <div className="text-gray-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoBox;
