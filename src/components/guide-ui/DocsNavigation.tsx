import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSidebarConfig } from '../../data/sidebarConfig';
import { guides } from '../../data/guides';

interface NavItem {
  name: string;
  href: string;
}

/**
 * Builds a flat list of all navigable doc pages in order
 */
const useNavigationList = (): NavItem[] => {
  return useMemo(() => {
    const sidebarConfig = getSidebarConfig();
    const navList: NavItem[] = [];

    // Sort items by order
    const sortedItems = [...sidebarConfig.items]
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order);

    for (const item of sortedItems) {
      // Skip home and non-doc pages like contribute
      if (item.id === 'home') continue;

      // Add the main item
      navList.push({ name: item.name, href: item.href });

      // If item has a category, find matching category in guides
      if (item.category) {
        const categoryData = guides.find(g => 
          g.category.toLowerCase().replace(/\s+/g, '') === item.category ||
          g.category.toLowerCase().replace(/\s+/g, '-') === item.category
        );
        
        if (categoryData) {
          for (const guideItem of categoryData.items) {
            // Don't add if it's the same as the main category page
            if (guideItem.path !== item.href) {
              navList.push({ name: guideItem.title, href: guideItem.path });
            }
          }
        }
      }

      // Also check for sub-items defined in config
      if (item.items) {
        for (const subItem of item.items.filter(s => s.visible)) {
          if (!navList.some(n => n.href === subItem.href)) {
            navList.push({ name: subItem.name, href: subItem.href });
          }
        }
      }
    }

    return navList;
  }, []);
};

const DocsNavigation: React.FC = () => {
  const location = useLocation();
  const navList = useNavigationList();
  
  // Find current page index
  const currentIndex = navList.findIndex(item => 
    location.pathname === item.href || 
    location.pathname.startsWith(item.href + '/')
  );

  const prevPage = currentIndex > 0 ? navList[currentIndex - 1] : null;
  const nextPage = currentIndex < navList.length - 1 ? navList[currentIndex + 1] : null;

  // Don't render if we can't find the current page or there's nothing to navigate to
  if (currentIndex === -1 || (!prevPage && !nextPage)) {
    return null;
  }

  return (
    <motion.nav 
      className="mt-12 pt-6 border-t border-gray-800/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      aria-label="Docs navigation"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Previous */}
        {prevPage ? (
          <Link
            to={prevPage.href}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 text-xs sm:text-sm text-gray-500 hover:text-orange-400 border border-gray-800/60 hover:border-orange-500/30 rounded-md bg-gray-900/30 hover:bg-gray-900/50 transition-all"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="hidden sm:inline">Previous:</span>
            <span className="text-gray-400 group-hover:text-orange-400 truncate max-w-[100px] sm:max-w-[160px]">
              {prevPage.name}
            </span>
          </Link>
        ) : (
          <div /> 
        )}

        {/* Next */}
        {nextPage ? (
          <Link
            to={nextPage.href}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 text-xs sm:text-sm text-gray-500 hover:text-orange-400 border border-gray-800/60 hover:border-orange-500/30 rounded-md bg-gray-900/30 hover:bg-gray-900/50 transition-all"
          >
            <span className="hidden sm:inline">Next:</span>
            <span className="text-gray-400 group-hover:text-orange-400 truncate max-w-[100px] sm:max-w-[160px]">
              {nextPage.name}
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </motion.nav>
  );
};

export default DocsNavigation;
