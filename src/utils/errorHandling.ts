/**
 * Centralized error handling utilities with user-friendly messages.
 * Maps technical errors to actionable messages for end users.
 */

/** Error categories for consistent handling */
export type ErrorCategory = 
  | 'network'
  | 'auth'
  | 'storage'
  | 'content'
  | 'validation'
  | 'unknown';

/** Structured error with user-friendly information */
export interface AppError {
  /** Original error for logging */
  original: unknown;
  /** User-friendly title */
  title: string;
  /** Detailed message for the user */
  message: string;
  /** Error category for conditional handling */
  category: ErrorCategory;
  /** Suggested action the user can take */
  action?: string;
  /** Whether the error is recoverable */
  recoverable: boolean;
}

/**
 * Network error messages with recovery suggestions
 */
const NETWORK_ERRORS: Record<string, Pick<AppError, 'title' | 'message' | 'action'>> = {
  'Failed to fetch': {
    title: 'Connection Failed',
    message: 'Unable to reach the server. Please check your internet connection.',
    action: 'Try refreshing the page or check your network settings.',
  },
  'NetworkError': {
    title: 'Network Error',
    message: 'A network error occurred while processing your request.',
    action: 'Check if you\'re connected to the internet and try again.',
  },
  'CORS': {
    title: 'Access Denied',
    message: 'The server rejected the request due to security restrictions.',
    action: 'This usually resolves itself. Try again in a few moments.',
  },
  'timeout': {
    title: 'Request Timeout',
    message: 'The server took too long to respond.',
    action: 'The server might be busy. Please try again in a few seconds.',
  },
};

/**
 * Storage/IndexedDB error messages
 */
const STORAGE_ERRORS: Record<string, Pick<AppError, 'title' | 'message' | 'action'>> = {
  'QuotaExceededError': {
    title: 'Storage Full',
    message: 'Your browser\'s storage is full. Some drafts may not be saved.',
    action: 'Delete old drafts or clear browser data to free up space.',
  },
  'InvalidStateError': {
    title: 'Storage Unavailable',
    message: 'Browser storage is currently unavailable.',
    action: 'Try closing other tabs or restarting your browser.',
  },
  'AbortError': {
    title: 'Save Interrupted',
    message: 'The save operation was interrupted.',
    action: 'Your draft should still be in memory. Try saving again.',
  },
};

/**
 * Authentication error messages
 */
const AUTH_ERRORS: Record<string, Pick<AppError, 'title' | 'message' | 'action'>> = {
  '401': {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    action: 'Click "Login" to authenticate.',
  },
  '403': {
    title: 'Access Denied',
    message: 'You don\'t have permission to perform this action.',
    action: 'Contact an administrator if you believe this is an error.',
  },
  'invalid_password': {
    title: 'Invalid Password',
    message: 'The password you entered is incorrect.',
    action: 'Check your password and try again.',
  },
};

/**
 * Content loading error messages
 */
const CONTENT_ERRORS: Record<string, Pick<AppError, 'title' | 'message' | 'action'>> = {
  '404': {
    title: 'Content Not Found',
    message: 'The guide you\'re looking for doesn\'t exist or has been moved.',
    action: 'Check the URL or browse our guides to find what you need.',
  },
  '500': {
    title: 'Server Error',
    message: 'Something went wrong on our end while loading the content.',
    action: 'Please try again. If the problem persists, report it to us.',
  },
  'parse_error': {
    title: 'Invalid Content',
    message: 'The content couldn\'t be loaded due to a formatting error.',
    action: 'This is likely a bug. Please report it so we can fix it.',
  },
};

/**
 * Determines the error category from error details
 */
function categorizeError(error: unknown): ErrorCategory {
  const errorString = String(error).toLowerCase();
  const errorName = error instanceof Error ? error.name : '';
  
  // Network errors
  if (
    errorString.includes('fetch') ||
    errorString.includes('network') ||
    errorString.includes('cors') ||
    errorString.includes('timeout') ||
    errorName === 'TypeError' && errorString.includes('failed')
  ) {
    return 'network';
  }
  
  // Storage errors
  if (
    errorString.includes('quota') ||
    errorString.includes('indexeddb') ||
    errorString.includes('storage') ||
    errorName.includes('Quota') ||
    errorName.includes('InvalidState')
  ) {
    return 'storage';
  }
  
  // Auth errors
  if (
    errorString.includes('401') ||
    errorString.includes('403') ||
    errorString.includes('unauthorized') ||
    errorString.includes('password')
  ) {
    return 'auth';
  }
  
  // Content errors
  if (
    errorString.includes('404') ||
    errorString.includes('not found') ||
    errorString.includes('parse') ||
    errorString.includes('json')
  ) {
    return 'content';
  }
  
  // Validation errors
  if (
    errorString.includes('valid') ||
    errorString.includes('required') ||
    errorString.includes('missing')
  ) {
    return 'validation';
  }
  
  return 'unknown';
}

/**
 * Converts any error into a user-friendly AppError.
 * Use this in catch blocks to get consistent error messages.
 * 
 * @param error - The caught error (can be any type)
 * @param context - Optional context about what operation failed
 * @returns Structured AppError with user-friendly messaging
 * 
 * @example
 * try {
 *   await saveDraft(data);
 * } catch (e) {
 *   const appError = parseError(e, 'saving your draft');
 *   addToast('error', appError.title, appError.message);
 * }
 */
export function parseError(error: unknown, context?: string): AppError {
  const category = categorizeError(error);
  const errorString = String(error);
  const errorMessage = error instanceof Error ? error.message : errorString;
  
  // Try to find a matching predefined error
  let matchedError: Pick<AppError, 'title' | 'message' | 'action'> | undefined;
  
  const errorMaps: Record<ErrorCategory, Record<string, Pick<AppError, 'title' | 'message' | 'action'>>> = {
    network: NETWORK_ERRORS,
    storage: STORAGE_ERRORS,
    auth: AUTH_ERRORS,
    content: CONTENT_ERRORS,
    validation: {},
    unknown: {},
  };
  
  const categoryMap = errorMaps[category];
  
  // Find matching error message
  for (const [key, value] of Object.entries(categoryMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      matchedError = value;
      break;
    }
  }
  
  // Default error if no match found
  if (!matchedError) {
    const contextStr = context ? ` while ${context}` : '';
    matchedError = {
      title: 'Something Went Wrong',
      message: `An unexpected error occurred${contextStr}. Please try again.`,
      action: 'If this keeps happening, try refreshing the page.',
    };
  }
  
  return {
    original: error,
    title: matchedError.title,
    message: matchedError.message,
    category,
    action: matchedError.action,
    recoverable: category !== 'auth' && category !== 'content',
  };
}

/**
 * Quick helper for logging errors in development
 */
export function logError(error: AppError, operation?: string): void {
  if (import.meta.env.DEV) {
    console.group(`🔴 ${error.title}${operation ? ` (${operation})` : ''}`);
    console.error('Category:', error.category);
    console.error('Message:', error.message);
    console.error('Original:', error.original);
    console.groupEnd();
  }
}

/**
 * Creates a standardized error response for API functions
 */
export function createErrorResponse(error: unknown, context?: string): { 
  success: false; 
  error: AppError;
} {
  return {
    success: false,
    error: parseError(error, context),
  };
}
