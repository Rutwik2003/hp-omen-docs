/**
 * Session management utility for admin authentication.
 * Provides secure session handling with expiration and hash-based storage.
 * 
 * Security improvements over plain sessionStorage:
 * - Stores session hash instead of raw password
 * - Automatic expiration (default: 2 hours)
 * - Session validation on each access
 */

const SESSION_KEY = 'admin_session';
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

interface SessionData {
    /** Hash of session identifier (not the password) */
    sessionHash: string;
    /** Timestamp when session was created */
    createdAt: number;
    /** Timestamp when session expires */
    expiresAt: number;
}

/**
 * Generates a simple hash for session identification.
 * Note: This is NOT cryptographically secure - for true security, 
 * use httpOnly cookies with server-side session management.
 */
const generateSessionHash = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Creates a new authenticated session.
 * Call this after successful password verification.
 * 
 * @param identifier - Unique session identifier (can be timestamp or random)
 * @returns The session hash for reference
 */
export const createSession = async (identifier?: string): Promise<string> => {
    const sessionId = identifier || crypto.randomUUID();
    const sessionHash = await generateSessionHash(sessionId);
    
    const session: SessionData = {
        sessionHash,
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_EXPIRY_MS,
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return sessionHash;
};

/**
 * Validates the current session.
 * Checks if session exists and hasn't expired.
 * 
 * @returns True if valid session exists, false otherwise
 */
export const validateSession = (): boolean => {
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return false;
        
        const session: SessionData = JSON.parse(stored);
        
        // Check expiration
        if (Date.now() > session.expiresAt) {
            clearSession();
            return false;
        }
        
        return true;
    } catch {
        clearSession();
        return false;
    }
};

/**
 * Gets the current session hash if valid.
 * 
 * @returns Session hash or null if no valid session
 */
export const getSessionHash = (): string | null => {
    if (!validateSession()) return null;
    
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return null;
        
        const session: SessionData = JSON.parse(stored);
        return session.sessionHash;
    } catch {
        return null;
    }
};

/**
 * Clears the current session (logout).
 */
export const clearSession = (): void => {
    sessionStorage.removeItem(SESSION_KEY);
};

/**
 * Extends the current session expiry.
 * Call this on user activity to keep session alive.
 */
export const extendSession = (): void => {
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return;
        
        const session: SessionData = JSON.parse(stored);
        session.expiresAt = Date.now() + SESSION_EXPIRY_MS;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
        // Session invalid, do nothing
    }
};
