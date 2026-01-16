import React from 'react';

interface StepSectionProps {
  number: number | string;
  title: string;
  children: React.ReactNode;
}

const StepSection: React.FC<StepSectionProps> = ({ number, title, children }) => {
  return (
    <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
          {number}
        </div>
        <h2 className="text-2xl font-bold text-white pt-1">{title}</h2>
      </div>
      <div className="pl-0 md:pl-14 text-gray-300 space-y-4">
        {children}
      </div>
    </section>
  );
};

export default StepSection;
