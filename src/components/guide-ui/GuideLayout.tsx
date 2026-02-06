import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ScrollToTop from '../ScrollToTop';
import { getPageIllustration } from './PageIllustrations';

interface GuideLayoutProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; path?: string }[];
  metadata?: {
    difficulty?: string;
    readTime?: string;
    lastUpdated?: string;
  };
  children: React.ReactNode;
  backgroundImage?: string;
  pageId?: string; // For matching illustrations
}

const GuideLayout: React.FC<GuideLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  metadata,
  children,
  backgroundImage = "/Hp_Omen_image.avif",
  pageId
}) => {
  // Get the appropriate illustration for this page
  const Illustration = pageId ? getPageIllustration(pageId) : null;
  
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ScrollToTop />
      
      {/* Hero Section - Responsive height with proper mobile header spacing */}
      <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="Guide Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Content - Added top padding for mobile header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pt-16 sm:pt-20 pb-8 sm:pb-10 md:pb-12">
          {/* Breadcrumbs - Improved mobile spacing */}
          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-orange-400 transition-colors shrink-0">Home</Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-orange-400 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-orange-400 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Main content row - text on left, illustration on right */}
          <div className="flex items-center justify-between gap-8">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Title - Improved responsive sizing to prevent cutoff */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight break-words">
                {title}
              </h1>
              {/* Description - Responsive text sizing */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                {description}
              </p>

              {/* Metadata Badges - Improved mobile layout */}
              {metadata && (
                 <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
                  {metadata.difficulty && (
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${
                      metadata.difficulty === 'Beginner' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                      metadata.difficulty === 'Intermediate' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                      'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      {metadata.difficulty}
                    </span>
                  )}
                  {metadata.readTime && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border bg-blue-500/10 border-blue-500/30 text-blue-400">
                      ⏱ {metadata.readTime}
                    </span>
                  )}
                  {metadata.lastUpdated && (
                     <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border bg-gray-500/10 border-gray-500/30 text-gray-400">
                      Updated: {metadata.lastUpdated}
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Illustration - vertically centered with content */}
            {Illustration && (
              <motion.div 
                className="hidden md:flex items-center justify-center flex-shrink-0 pointer-events-none"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 0.9, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Illustration size="lg" className="drop-shadow-2xl" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
           {children}
        </div>
      </div>
    </div>
  );
};

export default GuideLayout;
