import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
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

interface DocsLayoutProps {
  children?: React.ReactNode;
}

import { getAllDocs } from '../utils/contentLoader';

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const allDocs = getAllDocs();

  // Auto-close sidebar on route changes (for mobile reliability)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Helper to get items for a category
  const getCategoryItems = (cat: string) => {
    return allDocs
      .filter(doc => doc.category === cat)
      .map(doc => ({ name: doc.title, href: doc.path }));
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { 
      name: 'Quick Start', 
      href: '/quickstart', 
      icon: Zap,
      items: getCategoryItems('quickstart')
    },
    { 
      name: 'Windows Guides', 
      href: '/windows', 
      icon: Monitor,
      items: getCategoryItems('windows')
    },
    { name: 'Linux Guides', href: '/linux', icon: Settings, items: getCategoryItems('linux') },
    { name: 'Troubleshooting', href: '/troubleshooting', icon: HelpCircle },
    { 
      name: 'Performance', 
      href: '/performance', 
      icon: Zap,
      items: getCategoryItems('performance')
    },
    { name: 'Drivers & Software', href: '/drivers', icon: Download },
    { name: 'Hardware Guides', href: '/hardware', icon: Wrench },
    { name: 'Contribute', href: '/contribute', icon: ExternalLink},
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

        <nav className="flex-1 overflow-y-auto px-2 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/'); // Basic active check
            const hasChildren = item.items && item.items.length > 0;
            
            return (
              <div key={item.name} className="mb-0.5 lg:mb-1">
                <Link
                  to={item.href}
                  className={`group flex items-center px-3 lg:px-4 py-2.5 lg:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive && !hasChildren
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 omen-glow'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 hover:border-orange-500/20 border border-transparent'
                  }`}
                  onClick={() => !hasChildren && setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 lg:mr-4 h-4 w-4 lg:h-5 lg:w-5 transition-colors ${
                      isActive ? 'text-orange-400' : 'text-gray-400 group-hover:text-orange-400'
                    }`}
                  />
                  <span className="truncate text-sm lg:text-base">{item.name}</span>
                </Link>

                {/* Render Nested Items if any */}
                {hasChildren && (
                  <div className="ml-8 lg:ml-12 mt-1 space-y-0.5 lg:space-y-1 border-l border-gray-800 pl-2">
                    {item.items?.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm rounded-lg transition-colors ${
                            isSubActive 
                              ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Community Links */}
        <div className="flex-shrink-0 p-3 lg:p-6 border-t border-orange-500/20 bg-gradient-to-t from-black to-transparent">
          <a
            href="https://discord.com/invite/omen-by-hp-750760232954888363"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 lg:px-4 lg:py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-xl transition-all duration-200 group"
          >
            <MessageCircle className="mr-3 lg:mr-4 h-4 w-4 lg:h-5 lg:w-5 group-hover:text-red-400" />
            <span className="text-sm lg:text-base">Discord</span>
            <ExternalLink className="ml-auto h-3 w-3 lg:h-4 lg:w-4" />
          </a>
          <div className="mt-2 lg:mt-4 text-center">
            <div className='text-sm text-gray-500'>OMEN Gaming</div>
            <div className="text-xs lg:text-sm text-orange-400 font-medium">Community Docs</div>
            <div className="text-[10px] lg:text-xs text-gray-600">Unofficial Fan Project</div>
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
            {children || <Outlet />}
          </AnimatedLayout>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
