// In-memory rate limiting with automatic cleanup
// Note: On serverless (Vercel), each instance has its own Map which resets on cold starts.
// This provides best-effort protection without requiring external services.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 save requests per minute
const MAX_MAP_SIZE = 10000; // Prevent memory leak from tracking too many IPs

function isRateLimited(ip) {
  const now = Date.now();
  
  // Prevent unbounded memory growth
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
  return record.count > MAX_REQUESTS;
}

/**
 * Validates the request Origin header to prevent CSRF attacks.
 */
function isValidOrigin(req) {
  const origin = req.headers['origin'];
  if (!origin) return true;
  
  const allowedOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.SITE_URL || null,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  if (origin.endsWith('.vercel.app')) return true;
  
  return allowedOrigins.includes(origin);
}

import { timingSafeEqual, createHash, createHmac } from 'crypto';

/**
 * Timing-safe password comparison to prevent timing side-channel attacks.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

/** Max token age: 2 hours */
const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

/**
 * Validates a signed session token (issued by /api/verify).
 * Checks HMAC signature integrity and expiry.
 */
function validateSessionToken(token, secret) {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const expectedSig = createHmac('sha256', secret).update(payloadB64).digest('base64url');

  // Timing-safe signature check
  if (!safeCompare(signature, expectedSig)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    // Check expiry
    if (typeof payload.iat !== 'number') return false;
    if (Date.now() - payload.iat > TOKEN_MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // CSRF: Validate request origin
  if (!isValidOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Rate limiting check
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   'unknown';
  
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again in 1 minute.' 
    });
  }

  const { id, content, password, token } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const TOKEN_SECRET = process.env.SESSION_SECRET || ADMIN_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  // Use non-VITE_ prefixed vars on the server side to avoid client bundle exposure
  const REPO_OWNER = process.env.GITHUB_REPO_OWNER || process.env.VITE_GITHUB_REPO_OWNER;
  const REPO_NAME = process.env.GITHUB_REPO_NAME || process.env.VITE_GITHUB_REPO_NAME;

  // 1. Auth Check — accept session token (preferred) or password (legacy)
  let isAuthenticated = false;
  if (token && TOKEN_SECRET) {
    isAuthenticated = validateSessionToken(token, TOKEN_SECRET);
  }
  if (!isAuthenticated && ADMIN_PASSWORD) {
    isAuthenticated = safeCompare(password || '', ADMIN_PASSWORD);
  }
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    // Generic error — don't reveal which env vars are missing
    console.error('Missing required environment variables for GitHub integration');
    return res.status(500).json({ error: 'Internal server error' });
  }

  try {
    const path = `src/content/${id}`;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    // 2. Get current SHA
    const getRes = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'HP-Omen-Docs-Admin'
      }
    });
    
    // File might not exist yet (creating new)
    let sha = null;
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    // 3. Push update
    const body = {
      message: `Update ${content.title || id} via Admin Panel`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      sha: sha
    };

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'HP-Omen-Docs-Admin'
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      // Log full error server-side but return generic message to client
      console.error(`GitHub API error (${putRes.status}):`, errText);
      return res.status(putRes.status).json({ error: 'Failed to save content. Please try again.' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Save error:', error);
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
