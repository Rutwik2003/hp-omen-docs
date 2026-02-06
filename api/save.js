// Simple in-memory rate limiting (per Vercel instance)
// For production, consider using Upstash Redis for distributed rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 save requests per minute

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
  return record.count > MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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

  const { id, content, password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.VITE_GITHUB_REPO_OWNER;
  const REPO_NAME = process.env.VITE_GITHUB_REPO_NAME;

  // 1. Auth Check
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return res.status(500).json({ error: 'Server misconfiguration: GitHub details missing' });
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
      return res.status(putRes.status).json({ error: `GitHub Error: ${errText}` });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
