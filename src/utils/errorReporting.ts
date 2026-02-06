/**
 * Error Reporting Utility
 * 
 * Simple error logging and reporting without external dependencies.
 * Logs errors to console with structured format and stores in localStorage
 * for later review in development.
 */

interface ErrorReport {
    id: string;
    timestamp: string;
    message: string;
    stack?: string;
    componentStack?: string;
    pathname: string;
    userAgent: string;
}

const ERROR_LOG_KEY = 'hp_omen_error_log';
const MAX_STORED_ERRORS = 50;

/**
 * Generate a simple unique ID for error tracking
 */
function generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get stored errors from localStorage
 */
export function getStoredErrors(): ErrorReport[] {
    try {
        const stored = localStorage.getItem(ERROR_LOG_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Store an error report in localStorage (for dev review)
 */
function storeError(report: ErrorReport): void {
    try {
        const errors = getStoredErrors();
        errors.unshift(report);
        
        // Keep only the most recent errors
        const trimmed = errors.slice(0, MAX_STORED_ERRORS);
        localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmed));
    } catch {
        // Silently fail if localStorage is unavailable
    }
}

/**
 * Clear all stored error logs
 */
export function clearStoredErrors(): void {
    try {
        localStorage.removeItem(ERROR_LOG_KEY);
    } catch {
        // Silently fail
    }
}

/**
 * Capture and log an error with context
 * In development: logs to console with full details
 * In production: stores in localStorage for potential later review
 */
export function captureError(
    error: Error,
    context?: { componentStack?: string; [key: string]: unknown }
): void {
    const report: ErrorReport = {
        id: generateErrorId(),
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: context?.componentStack,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
    };

    // Always log in development
    if (import.meta.env.DEV) {
        console.group(`🔴 Error Captured: ${report.id}`);
        console.error('Error:', error);
        console.log('Pathname:', report.pathname);
        console.log('Timestamp:', report.timestamp);
        if (context?.componentStack) {
            console.log('Component Stack:', context.componentStack);
        }
        if (context) {
            const { componentStack, ...rest } = context;
            if (Object.keys(rest).length > 0) {
                console.log('Additional Context:', rest);
            }
        }
        console.groupEnd();
    } else {
        // In production, store for potential review
        // Could be enhanced to send to a backend endpoint
        storeError(report);
        
        // Minimal console output in production
        console.error(`[Error ${report.id}] ${error.message}`);
    }
}

/**
 * Log a warning message with context
 */
export function logWarning(message: string, context?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
        console.warn(`⚠️ ${message}`, context || '');
    }
}

/**
 * Log an info message (dev only)
 */
export function logInfo(message: string, context?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
        console.info(`ℹ️ ${message}`, context || '');
    }
}
