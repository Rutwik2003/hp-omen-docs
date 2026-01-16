import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ScrollToTop from '../ScrollToTop';

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
}

const GuideLayout: React.FC<GuideLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  metadata,
  children,
  backgroundImage = "/Hp_Omen_image.avif"
}) => {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ScrollToTop />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] overflow-hidden">
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

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4" />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
              {description}
            </p>

            {/* Metadata Badges */}
            {metadata && (
               <div className="flex flex-wrap gap-4 mt-6">
                {metadata.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    metadata.difficulty === 'Beginner' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    metadata.difficulty === 'Intermediate' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                    'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {metadata.difficulty}
                  </span>
                )}
                {metadata.readTime && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-500/10 border-blue-500/30 text-blue-400">
                    ⏱ {metadata.readTime}
                  </span>
                )}
                {metadata.lastUpdated && (
                   <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-500/10 border-gray-500/30 text-gray-400">
                    Updated: {metadata.lastUpdated}
                  </span>
                )}
              </div>
            )}
          </motion.div>
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
