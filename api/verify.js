// Simple in-memory rate limiting (per Vercel instance)
// For production, consider using Upstash Redis for distributed rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5; // 5 attempts per minute

function isRateLimited(ip) {
  const now = Date.now();
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

export default function handler(request, response) {
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
    return response.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD not set' });
  }

  if (password === ADMIN_PASSWORD) {
    return response.status(200).json({ success: true });
  } else {
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
