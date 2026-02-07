import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Home,
  Menu,
  X,
  Search
} from 'lucide-react';
import AnimatedLayout from './AnimatedLayout';
import { AVAILABLE_ICONS, getSidebarConfig, SidebarConfig } from '../../data/sidebarConfig';
import { guides } from '../../data/guides';

// Lazy load SearchModal
const SearchModal = lazy(() => import('../docs/SearchModal'));

interface DocsLayoutProps {
  children?: React.ReactNode;
}

import { getAllDocs } from '../../utils/contentLoader';

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>(() => getSidebarConfig());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const allDocs = getAllDocs();

  // Listen for sidebar config updates
  useEffect(() => {
    const handleConfigUpdate = () => {
      setSidebarConfig(getSidebarConfig());
    };
    
    window.addEventListener('sidebarConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('sidebarConfigUpdated', handleConfigUpdate);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-close sidebar on route changes (for mobile reliability)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Helper to get items for a category - use guides.ts for ordering
  const getCategoryItems = useCallback((cat: string) => {
    // Find the guide category to get proper ordering
    const categoryMap: Record<string, string> = {
      'quickstart': 'Quick Start',
      'windows': 'Windows',
      'performance': 'Performance',
      'troubleshooting': 'Troubleshooting',
      'hardware': 'Hardware',
      'linux': 'Linux'
    };
    const guideCategory = guides.find(g => g.category === categoryMap[cat]);
    
    if (guideCategory) {
      // Filter out the overview items (paths without /docs/) and return ordered items
      return guideCategory.items
        .filter(item => item.path.includes('/docs/'))
        .map(item => ({ name: item.title, href: item.path }));
    }
    
    // Fallback to unordered docs if no guide category found
    return allDocs
      .filter(doc => doc.category === cat)
      .map(doc => ({ name: doc.title, href: doc.path }));
  }, [allDocs]);

  // Build navigation from config
  const navigation = useMemo(() => {
    return sidebarConfig.items
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        name: item.name,
        href: item.href,
        icon: AVAILABLE_ICONS[item.icon] || Home,
        items: item.category ? getCategoryItems(item.category) : undefined,
      }));
  }, [sidebarConfig, getCategoryItems]);

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Skip link for keyboard accessibility - WCAG 2.4.1 */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] bg-orange-500 text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-orange-500/20 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-80 flex flex-col safe-area-inset`}>
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
            aria-label="Close navigation menu"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
          {/* Search Button - part of navigation list */}
          <div className="mb-0.5 lg:mb-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full group flex items-center px-3 lg:px-4 py-2.5 lg:py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 hover:border-orange-500/20 border border-transparent"
              aria-label="Search documentation"
            >
              <Search className="mr-3 lg:mr-4 h-4 w-4 lg:h-5 lg:w-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
              <span className="truncate text-sm lg:text-base flex-1 text-left">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-black/60 rounded border border-gray-700/60">
                ⌘K
              </kbd>
            </button>
          </div>
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
                          className={`block px-2 lg:px-3 py-2.5 lg:py-2.5 text-xs lg:text-sm rounded-lg transition-colors ${
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

        {/* Community Footer - Compact but Readable */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-orange-500/20 bg-black/40">
          {/* Discord Link */}
          {sidebarConfig.footerLinks.discord.visible && (
            <a
              href={sidebarConfig.footerLinks.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-2.5 py-2 mb-2 text-gray-400 hover:text-white hover:bg-indigo-500/15 rounded-lg transition-all duration-200 group"
            >
              {/* Discord SVG Logo */}
              <svg className="h-4 w-4 flex-shrink-0 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span className="text-sm">{sidebarConfig.footerLinks.discord.label}</span>
            </a>
          )}
          
          {/* Branding */}
          <div className="px-2.5 text-xs text-gray-500">
            <span className="text-orange-400/80">{sidebarConfig.footerLinks.branding.subtitle}</span>
            <span className="mx-1">·</span>
            <span>{sidebarConfig.footerLinks.branding.tagline}</span>
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
              aria-label="Open navigation menu"
              className="p-2.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
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
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 focus:outline-none">
          <AnimatedLayout>
            {children || <Outlet />}
          </AnimatedLayout>
        </main>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </Suspense>
      )}
    </div>
  );
};

export default DocsLayout;
