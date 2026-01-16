import React from 'react';
import { useLocation } from 'react-router-dom';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {children}
    </div>
  );
};

export default RootLayout;
