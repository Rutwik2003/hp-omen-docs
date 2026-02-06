import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface PrerequisitesListProps {
  items: string[];
}

const PrerequisitesList: React.FC<PrerequisitesListProps> = ({ items }) => {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <motion.li 
          key={index} 
          className="flex items-start gap-3 bg-gradient-to-r from-white/5 to-transparent p-3.5 rounded-xl border border-white/10 hover:border-green-500/30 transition-all duration-300 group"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/30 group-hover:from-green-500/30 group-hover:to-green-600/20 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-gray-300 text-sm md:text-base leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

export default PrerequisitesList;
