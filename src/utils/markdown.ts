import DOMPurify, { Config } from 'dompurify';

/**
 * Enhanced markdown to HTML converter with visual improvements
 * Supports: bold, italic, inline code, links, checkmarks, numbered lists, bullet points
 */
export const parseMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    // Bold: **text** or __text__ - with gradient styling
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*([^*]+)\*/g, '<em class="text-gray-200">$1</em>')
    .replace(/_([^_]+)_/g, '<em class="text-gray-200">$1</em>')
    // Inline code: `code` - enhanced pill style
    .replace(/`([^`]+)`/g, '<code class="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-2 py-0.5 rounded-md text-orange-300 text-sm font-mono border border-orange-500/30">$1</code>')
    // Links: [text](url) - with icon hint
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 underline decoration-orange-500/50 underline-offset-2 transition-colors">$1</a>')
    // Checkmark items: ✓ text - highlight
    .replace(/✓\s*([^<\n]+)/g, '<span class="inline-flex items-center gap-1"><span class="text-green-400 font-bold">✓</span><span class="text-green-300">$1</span></span>')
    // Number prefix: 1. text -> styled number
    .replace(/^(\d+)\.\s+/gm, '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold mr-2">$1</span>')
    // Bullet points: • text -> styled bullets
    .replace(/•\s+/g, '<span class="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 align-middle"></span>');
};

/**
 * Default DOMPurify configuration for sanitizing HTML content
 */
export const DEFAULT_SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'span'],
  // Note: 'style' intentionally excluded to prevent CSS-based XSS (data exfiltration via background-image, ui redressing)
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
};

/**
 * Sanitize and parse markdown content to safe HTML
 * @param content - Raw content string (can include markdown)
 * @param config - Optional custom DOMPurify config
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export const sanitizeHtml = (content: string, config: Config = DEFAULT_SANITIZE_CONFIG): { __html: string } => ({
  __html: DOMPurify.sanitize(parseMarkdown(content), config) as string
});
