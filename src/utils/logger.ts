/**
 * Environment-conditional logging utility.
 * Prevents debug information from leaking to production console.
 * 
 * Usage:
 *   import { devLog, devWarn, devError } from '@/utils/logger';
 *   devLog('Debug message', data);
 */

const IS_DEV = import.meta.env.DEV;

/**
 * Logs to console only in development mode.
 */
export const devLog = (...args: unknown[]): void => {
    if (IS_DEV) {
        console.log('[DEV]', ...args);
    }
};

/**
 * Logs warning to console only in development mode.
 */
export const devWarn = (...args: unknown[]): void => {
    if (IS_DEV) {
        console.warn('[DEV]', ...args);
    }
};

/**
 * Logs error to console only in development mode.
 * For production errors, consider sending to error tracking service.
 */
export const devError = (...args: unknown[]): void => {
    if (IS_DEV) {
        console.error('[DEV]', ...args);
    }
};

/**
 * Creates a scoped logger with a prefix for easier filtering.
 * @param scope - Module or component name
 * @returns Logger functions scoped to the given name
 * 
 * @example
 * const log = createScopedLogger('GuideEditor');
 * log.info('Loading draft...'); // [DEV] [GuideEditor] Loading draft...
 */
export const createScopedLogger = (scope: string) => ({
    info: (...args: unknown[]) => devLog(`[${scope}]`, ...args),
    warn: (...args: unknown[]) => devWarn(`[${scope}]`, ...args),
    error: (...args: unknown[]) => devError(`[${scope}]`, ...args),
});
