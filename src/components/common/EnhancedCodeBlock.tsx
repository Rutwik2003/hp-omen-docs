import React, { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Terminal } from 'lucide-react';

interface EnhancedCodeBlockProps {
  code: string;
  language?: string;
}

/**
 * Enhanced code block with syntax highlighting appearance and copy functionality
 * Memoized to prevent unnecessary re-renders
 */
const EnhancedCodeBlock: React.FC<EnhancedCodeBlockProps> = memo(({ code, language }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <motion.div 
      className="relative group mb-4 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-gray-400 font-medium">{language || 'Command'}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {/* Code content */}
      <div className="bg-black/80 backdrop-blur-sm p-3 sm:p-4 border border-gray-800 border-t-0 rounded-b-xl">
        <code className="text-green-400 block whitespace-pre overflow-x-auto font-mono text-sm leading-relaxed">
          {code}
        </code>
      </div>
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 pointer-events-none" />
    </motion.div>
  );
});

EnhancedCodeBlock.displayName = 'EnhancedCodeBlock';

export default EnhancedCodeBlock;
