/**
 * Vercel Edge Middleware for CSP Nonce Injection
 * 
 * This middleware:
 * 1. Generates a cryptographic nonce for each request
 * 2. Injects the nonce into inline script tags
 * 3. Sets Content-Security-Policy header with the nonce
 * 
 * The nonce ensures inline scripts are only executed if they have the correct
 * nonce attribute, preventing XSS attacks from injecting malicious scripts.
 * 
 * Note: For Vite projects on Vercel, this requires the Edge Middleware runtime.
 */

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/* (API routes handle their own security)
     * - /_vercel/* (Vercel internals)
     * - Static asset extensions
     */
    '/((?!api/|_vercel/|.*\\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|json|webmanifest)$).*)',
  ],
};

/**
 * Generate a cryptographically secure random nonce
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Build Content-Security-Policy header value with nonce
 */
function buildCSP(nonce: string): string {
  const directives = [
    // Default fallback - restrict to same origin
    "default-src 'self'",
    
    // Scripts: Allow self, the nonce for inline scripts, and strict-dynamic for module scripts
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    
    // Styles: Allow self, inline styles (needed for Tailwind), and Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Fonts: Allow self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    
    // Images: Allow self, data URIs (for inline SVGs), and HTTPS sources
    "img-src 'self' data: https:",
    
    // Connect: Allow self and GitHub API (for contributor features)
    "connect-src 'self' https://api.github.com",
    
    // Frame ancestors: Prevent clickjacking
    "frame-ancestors 'none'",
    
    // Base URI: Restrict base tag to same origin
    "base-uri 'self'",
    
    // Form actions: Restrict form submissions to same origin
    "form-action 'self'",
    
    // Object sources: Block plugins like Flash
    "object-src 'none'",
    
    // Upgrade insecure requests in production
    "upgrade-insecure-requests",
  ];
  
  return directives.join('; ');
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Only process HTML page requests (not assets)
  const acceptHeader = request.headers.get('accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html');
  
  // For non-HTML requests, pass through without modification
  if (!isHtmlRequest) {
    return fetch(request);
  }
  
  // Generate a unique nonce for this request
  const nonce = generateNonce();
  
  // Fetch the original HTML from the origin
  const originResponse = await fetch(request);
  
  // Only modify HTML responses
  const contentType = originResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return originResponse;
  }
  
  // Get the HTML content
  let html = await originResponse.text();
  
  // Inject nonce into ALL script tags that don't already have a nonce
  // With 'strict-dynamic' CSP, both inline and external scripts need the nonce
  html = html.replace(
    /<script(?![^>]*\bnonce=)([^>]*)>/gi,
    `<script nonce="${nonce}"$1>`
  );
  
  // Copy headers from original response
  const newHeaders = new Headers(originResponse.headers);
  
  // Set CSP header with the nonce
  newHeaders.set('Content-Security-Policy', buildCSP(nonce));
  
  // Create new response with modified HTML and CSP header
  return new Response(html, {
    status: originResponse.status,
    statusText: originResponse.statusText,
    headers: newHeaders,
  });
}
