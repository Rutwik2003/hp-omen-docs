import React from 'react';
import { AnimatedCheck } from '../animated-icons';

interface PrerequisitesListProps {
  items: string[];
}

const PrerequisitesList: React.FC<PrerequisitesListProps> = ({ items }) => {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
          <AnimatedCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-300 text-sm md:text-base">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default PrerequisitesList;
