import type { Plugin, ViteDevServer } from 'vite';
import { randomBytes } from 'crypto';

/**
 * Vite Plugin for CSP Nonce Injection
 * 
 * This plugin:
 * 1. Generates a unique nonce for each HTML request during development
 * 2. Injects the nonce into inline script tags
 * 3. Sets Content-Security-Policy header with the nonce
 * 
 * In production, the Vercel Edge Middleware (middleware.ts) handles this.
 */

/**
 * Generate a cryptographically secure random nonce
 */
function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Build Content-Security-Policy header value with nonce
 * In dev mode, we also need 'unsafe-inline' as a fallback for timing issues
 */
function buildCSP(nonce: string, isDev: boolean): string {
  const directives = [
    // Default fallback - restrict to same origin
    "default-src 'self'",
    
    // Scripts: Allow self, the nonce for inline scripts
    // In dev mode, we need unsafe-eval for HMR and unsafe-inline as fallback
    isDev 
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline'`
      : `script-src 'self' 'nonce-${nonce}'`,
    
    // Styles: Allow self, inline styles (needed for Tailwind/HMR), and Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Fonts: Allow self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    
    // Images: Allow self, data URIs (for inline SVGs), and HTTPS sources
    "img-src 'self' data: https:",
    
    // Connect: Allow self, localhost for dev, and GitHub API
    "connect-src 'self' ws://localhost:* http://localhost:* https://api.github.com",
    
    // Frame ancestors: Prevent clickjacking
    "frame-ancestors 'none'",
    
    // Base URI: Restrict base tag to same origin
    "base-uri 'self'",
    
    // Form actions: Restrict form submissions to same origin
    "form-action 'self'",
    
    // Object sources: Block plugins like Flash
    "object-src 'none'",
  ];
  
  return directives.join('; ');
}

/**
 * Vite plugin that adds CSP nonce support during development
 */
export function cspNoncePlugin(): Plugin {
  // Store the current nonce to share between middleware and HTML transform
  let currentNonce = generateNonce();
  
  return {
    name: 'vite-plugin-csp-nonce',
    enforce: 'post',
    
    // Configure the dev server to add CSP headers BEFORE HTML transform
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        // Only add CSP headers for HTML requests
        const acceptHeader = req.headers.accept || '';
        if (acceptHeader.includes('text/html')) {
          // Generate a new nonce for this request
          currentNonce = generateNonce();
          res.setHeader('Content-Security-Policy', buildCSP(currentNonce, true));
        }
        next();
      });
    },
    
    // Transform the HTML during development
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Use the nonce that was set in the middleware for this request
        const nonce = currentNonce;
        
        // Inject nonce into inline script tags (scripts without src attribute)
        // The regex matches <script> tags that don't have src or nonce attributes
        const modifiedHtml = html.replace(
          /<script(?![^>]*\b(?:src|nonce)=)([^>]*)>/gi,
          `<script nonce="${nonce}"$1>`
        );
        
        // Add a meta tag with the nonce for debugging (optional)
        // This can be removed in production
        return modifiedHtml.replace(
          '</head>',
          `  <!-- CSP Nonce for inline scripts -->\n    <meta name="csp-nonce" content="${nonce}">\n  </head>`
        );
      },
    },
  };
}

export default cspNoncePlugin;
