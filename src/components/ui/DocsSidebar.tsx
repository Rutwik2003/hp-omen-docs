import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

export type NavItem = {
  title: string;
  href?: string;
  items?: NavItem[];
  defaultOpen?: boolean;
};

export const DocsSidebar = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <div className="w-64 h-full bg-black/90 backdrop-blur-xl border-r border-white/5 overflow-y-auto py-6 pl-2 pr-4 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
      {navItems.map((item, idx) => (
        <SidebarItem key={idx} item={item} />
      ))}
    </div>
  );
};

const SidebarItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(item.defaultOpen || false);
  const location = useLocation();
  const isActive = item.href ? location.pathname === item.href : false;
  const hasChildren = item.items && item.items.length > 0;
  
  const itemRef = React.useRef<HTMLAnchorElement>(null);

  // Check if any child is active to auto-expand
  const hasActiveChild = React.useMemo(() => {
    if (!item.items) return false;
    const checkChildren = (children: NavItem[]): boolean => {
      return children.some(child => 
        (child.href === location.pathname) || (child.items && checkChildren(child.items))
      );
    };
    return checkChildren(item.items);
  }, [item.items, location.pathname]);

  // Auto-expand if active child exists
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  // Auto-scroll into view when active
  useEffect(() => {
    if (isActive && itemRef.current) {
      // Delay slightly to allow for expansion animations
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="mb-0.5">
      {item.href ? (
        <Link
          ref={itemRef}
          to={item.href}
          className={cn(
            "flex items-center py-2 px-3 rounded-lg text-sm transition-all duration-200 group relative",
            isActive
              ? "bg-orange-500/10 text-orange-500 font-medium"
              : "text-neutral-400 hover:text-white hover:bg-white/5",
            depth > 0 && "ml-4 text-xs"
          )}
        >
          {isActive && (
            <motion.div 
              layoutId="active-indicator"
              className="absolute left-0 w-0.5 h-4 bg-orange-500 rounded-full"
            />
          )}
          <span className="truncate">{item.title}</span>
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 text-neutral-400 hover:text-white hover:bg-white/5 group",
            depth > 0 && "ml-4"
          )}
        >
          <div className="flex items-center gap-2">
            {depth === 0 && <Folder className={cn("w-4 h-4 transition-colors", isOpen ? "text-orange-500" : "text-neutral-600 group-hover:text-neutral-400")} />}
            <span className={cn("font-medium", isOpen && "text-white")}>{item.title}</span>
          </div>
          {hasChildren && (
            <span className={cn("transition-transform duration-200", isOpen && "rotate-180")}>
              {isOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-2 border-l border-white/5 ml-4 mt-1 space-y-0.5">
              {item.items?.map((child, idx) => (
                <SidebarItem key={idx} item={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
