// In-memory rate limiting with automatic cleanup
// Note: On serverless (Vercel), each instance has its own Map which resets on cold starts.
// This provides best-effort protection without requiring external services.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5; // 5 attempts per minute
const MAX_MAP_SIZE = 10000; // Prevent memory leak from tracking too many IPs

function isRateLimited(ip) {
  const now = Date.now();
  
  // Prevent unbounded memory growth — purge stale entries when map gets large
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    for (const [key, val] of rateLimitMap) {
      if (now - val.firstAttempt > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return false;
  }
  
  // Reset window if expired
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return false;
  }
  
  record.count++;
  return record.count > MAX_ATTEMPTS;
}

/**
 * Validates the request Origin header to prevent CSRF attacks.
 * Allows requests from the same origin and known deployment domains.
 */
function isValidOrigin(request) {
  const origin = request.headers['origin'];
  // Allow requests with no origin (same-origin, curl, Postman)
  if (!origin) return true;
  
  const allowedOrigins = [
    // Production domain — update this when you deploy
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.SITE_URL || null,
    // Local development
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  // Also allow Vercel preview deployments
  if (origin.endsWith('.vercel.app')) return true;
  
  return allowedOrigins.includes(origin);
}

import { timingSafeEqual, createHash, createHmac } from 'crypto';

/**
 * Timing-safe password comparison to prevent timing side-channel attacks.
 * Uses SHA-256 hashing to ensure both buffers are the same length.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/**
 * Creates a signed session token using HMAC-SHA256.
 * Token format: base64(payload).base64(signature)
 * Payload contains issued-at timestamp for expiry checks.
 */
function createSessionToken(secret) {
  const payload = JSON.stringify({ iat: Date.now() });
  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export default function handler(request, response) {
  // CSRF: Validate request origin
  if (!isValidOrigin(request)) {
    return response.status(403).json({ error: 'Forbidden' });
  }

  // Rate limiting check
  const clientIp = request.headers['x-forwarded-for']?.split(',')[0] || 
                   request.headers['x-real-ip'] || 
                   'unknown';
  
  if (isRateLimited(clientIp)) {
    return response.status(429).json({ 
      error: 'Too many login attempts. Please try again in 1 minute.' 
    });
  }

  const { password } = request.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    // Generic error to avoid revealing server configuration details
    console.error('ADMIN_PASSWORD environment variable is not configured');
    return response.status(500).json({ error: 'Internal server error' });
  }

  if (safeCompare(password || '', ADMIN_PASSWORD)) {
    // Issue a signed session token so the client doesn't need to resend the password
    const tokenSecret = process.env.SESSION_SECRET || ADMIN_PASSWORD;
    const token = createSessionToken(tokenSecret);
    return response.status(200).json({ success: true, token });
  } else {
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
