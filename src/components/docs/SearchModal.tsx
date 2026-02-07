import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, FileText, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
  keywords: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { generateSearchIndex, SearchIndexItem } from '../../utils/contentLoader';

const searchIndex: SearchIndexItem[] = generateSearchIndex();

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    
    // Scoring system: Title match > Description match > Content match
    const filteredResults = searchIndex
      .map(item => {
        let score = 0;
        if (item.title.toLowerCase().includes(searchTerm)) score += 10;
        if (item.description.toLowerCase().includes(searchTerm)) score += 5;
        if (item.content.toLowerCase().includes(searchTerm)) score += 1;
        if (item.keywords.some(k => k.toLowerCase().includes(searchTerm))) score += 5;

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limit to top 10 results

    setResults(filteredResults);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].path);
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-12 sm:pt-20 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-black border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
        >
          {/* Search Input */}
          <div className="flex items-center p-3 sm:p-4 border-b border-gray-800 bg-gray-950/50">
            <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base min-w-0"
              autoFocus
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="p-2 text-gray-400 hover:text-white transition-colors shrink-0 -mr-1"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto bg-black/50">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <Link
                    key={result.path}
                    to={result.path}
                    onClick={onClose}
                    className={`block p-3 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-orange-500/20 border border-orange-500/30'
                        : 'hover:bg-gray-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-orange-400 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-white font-medium">{result.title}</div>
                          <div className="text-gray-400 text-sm">{result.description}</div>
                          <div className="text-orange-400 text-xs mt-1">{result.category}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">Try searching for "setup", "troubleshoot", or "performance"</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search the documentation</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-900 border border-gray-700 rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-900 border border-gray-700 rounded">Enter</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-900 border border-gray-700 rounded">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
