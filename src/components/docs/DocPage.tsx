import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface DocPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  metadata?: {
    lastUpdated?: string;
    author?: string;
    readTime?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  nextPage?: {
    title: string;
    path: string;
  };
  prevPage?: {
    title: string;
    path: string;
  };
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Intermediate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Advanced':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// Staggered animation variants - starts after page transition completes
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const DocPage: React.FC<DocPageProps> = ({
  title,
  description,
  children,
  breadcrumbs,
  metadata,
  nextPage,
  prevPage
}) => {
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <motion.div variants={itemVariants}>
          <Breadcrumbs items={breadcrumbs} />
        </motion.div>
      )}
      
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        
        {description && (
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6">
            {description}
          </p>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {metadata.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(metadata.difficulty)}`}>
                {metadata.difficulty}
              </span>
            )}
            {metadata.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {metadata.readTime}
              </div>
            )}
            {metadata.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {metadata.author}
              </div>
            )}
            {metadata.lastUpdated && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {metadata.lastUpdated}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="prose prose-invert prose-orange max-w-none"
      >
        <div className="documentation-content">
          {children}
        </div>
      </motion.div>

      {/* Navigation */}
      {(prevPage || nextPage) && (
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {prevPage && (
                <a
                  href={prevPage.path}
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors group"
                >
                  <span className="mr-2">←</span>
                  <div>
                    <div className="text-sm text-gray-400">Previous</div>
                    <div className="font-medium group-hover:underline">{prevPage.title}</div>
                  </div>
                </a>
              )}
            </div>
            
            <div className="flex-1 text-right">
              {nextPage && (
                <a
                  href={nextPage.path}
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors group"
                >
                  <div>
                    <div className="text-sm text-gray-400">Next</div>
                    <div className="font-medium group-hover:underline">{nextPage.title}</div>
                  </div>
                  <span className="ml-2">→</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DocPage;
