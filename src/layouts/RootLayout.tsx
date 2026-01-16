
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Book, Laptop, User, Settings, Terminal } from 'lucide-react';
import { cn } from '../utils';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-cyber-black text-white relative overflow-x-hidden font-sans selection:bg-neon-orange/30">
        {/* Animated Background Mesh (Simplified CSS/SVG) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-cyber-black to-black opacity-80"></div>
            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neon-orange/10 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-glow-pulse"></div>
        </div>

      {/* Main Content Area */}
      <main className="relative z-10 pb-24">
        <Outlet />
      </main>

      {/* Floating Dock Navigation */}
      <FloatingDock />
    </div>
  );
};

const FloatingDock = () => {
    const items = [
        { icon: <Home size={20} />, label: "Home", href: "/" },
        { icon: <Book size={20} />, label: "Docs", href: "/docs" },
        { icon: <Terminal size={20} />, label: "Setup", href: "/setup" },
        { icon: <Laptop size={20} />, label: "Optimization", href: "/optimization" },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            >
                {items.map((item, idx) => (
                    <DockItem key={idx} item={item} />
                ))}
            </motion.div>
        </div>
    );
}

const DockItem = ({ item }: { item: any }) => {
    return (
        <Link 
            to={item.href}
            className="relative group p-3 rounded-xl hover:bg-white/10 transition-colors duration-200"
        >
            <span className="text-neutral-400 group-hover:text-white transition-colors duration-200">
                {item.icon}
            </span>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {item.label}
            </span>
             {/* Active Indicator (Optional logic can be added) */}
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-orange opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </Link>
    )
}
