import { getAllDocs } from './contentLoader';

const IS_DEV = import.meta.env.DEV;

export const checkAuth = async (password: string): Promise<boolean> => {
    // Local Development: Simple check
    if (IS_DEV) {
        return password === 'admin123';
    }

    // Production: Verify against backend env var
    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return res.ok;
    } catch (e) {
        console.error('Auth verification failed', e);
        return false;
    }
};

export const fetchAdminContent = async () => {
    if (IS_DEV) {
        // Local: Fetch from our custom server.js
        const res = await fetch('http://localhost:3001/api/content');
        return res.json();
    } else {
        // Prod: Re-use build time content
        // Note: For a true dynamic admin, you might want to fetch fresh JSONs from GitHub here too via a proxy.
        // For simplicity, we stick to build-time content for LISTING, but save new content dynamically.
        return getAllDocs();
    }
};

export const saveContent = async (id: string, content: Record<string, unknown>, password?: string) => {
    if (IS_DEV) {
        // Local: Save via server.js
        const res = await fetch('http://localhost:3001/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, content }),
        });
        return res.json();
    } else {
        // Prod: Save via Vercel Serverless Proxy
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                content,
                password // Send custom password to authorize the proxy
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to save');
        }

        return res.json();
    }
};
