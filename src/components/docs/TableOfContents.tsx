import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Folder } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface TOCItem {
  id: string;
  title: string;
  path?: string;
  children?: TOCItem[];
  icon?: React.ComponentType<any>;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-expand items that contain the current path
    const pathSegments = location.pathname.split('/');
    const newExpanded = new Set<string>();
    
    const checkAndExpand = (items: TOCItem[], parentPath = '') => {
      items.forEach(item => {
        const fullPath = parentPath + '/' + item.id;
        if (item.path && pathSegments.some(segment => fullPath.includes(segment))) {
          newExpanded.add(item.id);
        }
        if (item.children) {
          checkAndExpand(item.children, fullPath);
        }
      });
    };
    
    checkAndExpand(items);
    setExpandedItems(newExpanded);
  }, [location.pathname, items]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: TOCItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && location.pathname === item.path;
    const Icon = item.icon || (hasChildren ? Folder : FileText);

    return (
      <motion.div
        key={item.id}
        initial={false}
        animate={{ opacity: 1 }}
        className={`${level > 0 ? 'ml-4' : ''}`}
      >
        <div
          className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer group ${
            isActive
              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30'
              : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
          }`}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 rounded hover:bg-gray-700/50 transition-colors mr-2"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </button>
          )}
          
          <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-orange-400' : 'text-gray-400'}`} />
          
          {item.path ? (
            <Link 
              to={item.path} 
              className="flex-1 text-sm font-medium hover:text-orange-400 transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span
              onClick={() => hasChildren && toggleExpanded(item.id)}
              className="flex-1 text-sm font-medium"
            >
              {item.title}
            </span>
          )}
        </div>

        {hasChildren && (
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-2 border-l border-gray-700/50 ml-2">
              {item.children?.map(child => renderItem(child, level + 1))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-1">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
};

export default TableOfContents;
