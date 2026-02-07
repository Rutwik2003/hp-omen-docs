import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav 
      className="flex items-center space-x-1 sm:space-x-2 text-sm mb-6 overflow-x-auto scrollbar-hide min-w-0 -mx-1 px-1" 
      aria-label="Breadcrumb"
    >
      <Link 
        to="/" 
        className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-gray-400 hover:text-orange-400 transition-colors rounded-lg flex-shrink-0"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-gray-400 hover:text-orange-400 transition-colors whitespace-nowrap py-2 px-1 min-h-[44px] flex items-center"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium whitespace-nowrap py-2 px-1 truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
