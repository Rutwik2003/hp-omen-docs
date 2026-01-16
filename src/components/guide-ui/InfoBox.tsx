import React from 'react';
import { AnimatedShield, AnimatedZap, AnimatedCheck } from '../animated-icons';
import { AlertTriangle, Info } from 'lucide-react';

interface InfoBoxProps {
  type: 'info' | 'warning' | 'success' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type, title, children }) => {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: Info
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: AlertTriangle
    },
    success: {
       bg: 'bg-green-500/10',
       border: 'border-green-500/30',
       text: 'text-green-400',
       icon: AnimatedCheck
    },
    tip: {
       bg: 'bg-purple-500/10',
       border: 'border-purple-500/30',
       text: 'text-purple-400',
       icon: AnimatedZap
    },
    danger: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: AnimatedShield
    }
  };

  const currentStyle = styles[type];
  const Icon = currentStyle.icon;

  return (
    <div className={`${currentStyle.bg} ${currentStyle.border} border rounded-xl p-4 md:p-6 my-4`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-6 h-6 mt-1 ${currentStyle.text}`}>
           <Icon className="w-full h-full" />
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={`text-base font-bold ${currentStyle.text} mb-1`}>
              {title}
            </h4>
          )}
          <div className="text-gray-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
