import { getAllDocs } from './contentLoader';
import { parseError, logError } from './errorHandling';

const IS_DEV = import.meta.env.DEV;

/**
 * Verifies admin password against dev environment variable or production API.
 * @param password - The password to verify
 * @returns true if authenticated, false otherwise
 */
export const checkAuth = async (password: string): Promise<boolean> => {
    // Local Development: Check against environment variable
    if (IS_DEV) {
        const devPassword = import.meta.env.VITE_DEV_ADMIN_PASSWORD;
        if (!devPassword) {
            console.warn('VITE_DEV_ADMIN_PASSWORD not set in .env file');
            return false;
        }
        return password === devPassword;
    }

    // Production: Verify against backend env var
    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return res.ok;
    } catch (error) {
        const appError = parseError(error, 'verifying your password');
        logError(appError, 'checkAuth');
        return false;
    }
};

/**
 * Fetches content for admin dashboard.
 * In dev: fetches from local server.js on port 3001
 * In prod: uses build-time content (for listing only)
 */
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

/**
 * Saves guide content to the repository.
 * In dev: saves via local server.js
 * In prod: saves via Vercel serverless function (commits to GitHub)
 * 
 * @param id - Guide identifier (e.g., 'performance/thermal-management')
 * @param content - The guide content object
 * @param password - Admin password for production auth
 * @throws Error with user-friendly message if save fails
 */
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
