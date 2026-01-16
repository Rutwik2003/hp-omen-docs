import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Zap, 
  Monitor, 
  Settings, 
  HelpCircle, 
  Download, 
  Wrench,
  Menu,
  X,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import AnimatedLayout from './AnimatedLayout';
import { PageTransitionWrapper } from './EnhancedAnimations';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const SidebarItem = ({ item, isActive, onClick }: { item: NavigationItem, isActive: boolean, onClick: () => void }) => {
  const itemRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (isActive && itemRef.current) {
        // Function to scroll
        const scroll = () => {
             itemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        };

        // Attempt immediate (next tick)
        const t1 = setTimeout(scroll, 100);
        
        // Attempt after potential animations
        const t2 = setTimeout(scroll, 500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }
  }, [isActive]);

  return (
    <Link
        ref={itemRef}
        to={item.href}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            isActive
            ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 omen-glow'
            : 'text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 hover:border-orange-500/20 border border-transparent'
        }`}
        onClick={onClick}
    >
        <item.icon
            className={`mr-4 h-5 w-5 transition-colors ${
            isActive ? 'text-orange-400' : 'text-gray-400 group-hover:text-orange-400'
            }`}
        />
        <span className="truncate text-base">{item.name}</span>
        {isActive && (
            <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse flex-shrink-0"></div>
        )}
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Quick Start', href: '/quickstart', icon: Zap },
    { name: 'Windows Guides', href: '/windows', icon: Monitor },
    { name: 'Linux Guides', href: '/linux', icon: Settings },
    { name: 'Troubleshooting', href: '/troubleshooting', icon: HelpCircle },
    { name: 'Performance', href: '/performance', icon: Zap },
    { name: 'Drivers & Software', href: '/drivers', icon: Download },
    { name: 'Hardware Guides', href: '/hardware', icon: Wrench },
  ];

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-orange-500/20 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-80 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-orange-500/20 bg-gradient-to-r from-black to-gray-900 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black/50 border border-orange-500/30 rounded-xl flex items-center justify-center omen-glow relative p-2">
              <img 
                src="/HP_Omen_logo.svg" 
                alt="HP OMEN Logo" 
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white omen-text-glow">OMEN</span>
              <div className="text-xs text-orange-400 font-medium">Documentation</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarItem 
                key={item.name} 
                item={item} 
                isActive={isActive} 
                onClick={() => setSidebarOpen(false)} 
              />
            );
          })}
        </nav>

        {/* Community Links */}
        <div className="flex-shrink-0 p-6 border-t border-orange-500/20 bg-gradient-to-t from-black to-transparent">
          <div className="space-y-3">
            <a
              href="https://discord.com/invite/omen-by-hp-750760232954888363"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-xl transition-all duration-200 group"
            >
              <MessageCircle className="mr-4 h-5 w-5 group-hover:text-red-400" />
              <span className="text-base">Discord Server</span>
              <ExternalLink className="ml-auto h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500">OMEN Gaming</div>
            <div className="text-sm text-orange-400 font-medium">Community Docs</div>
            <div className="text-xs text-gray-600 mt-1">Unofficial Fan Project</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header - Enhanced for better mobile experience */}
        <header className="bg-black border-b border-orange-500/20 lg:hidden shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 border border-orange-500/30 rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/HP_Omen_logo.svg" 
                  alt="HP OMEN Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white omen-text-glow">OMEN</span>
            </Link>
            <div className="w-8 sm:w-10"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <AnimatedLayout>
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
          </AnimatedLayout>
        </main>
      </div>
    </div>
  );
};

export default Layout;
