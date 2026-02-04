/**
 * Route path constants for the application
 * Centralized routing to avoid magic strings
 */
export const ROUTES = {
  // Main pages
  HOME: '/',
  QUICKSTART: '/quickstart',
  DRIVERS: '/drivers-software',
  
  // Documentation
  DOCS: '/docs',
  DOCS_CATEGORY: (category: string, slug: string) => `/docs/${category}/${slug}`,
  
  // Contribute section
  CONTRIBUTE: '/contribute',
  CONTRIBUTE_NEW: '/contribute/new',
  CONTRIBUTE_PLAYGROUND: '/contribute/playground',
  CONTRIBUTE_EDIT: (id: string) => `/contribute/edit/${id}`,
  
  // Admin section
  ADMIN: '/admin',
  ADMIN_NEW: '/admin/new',
  ADMIN_EDIT: (id: string) => `/admin/edit/${id}`,
} as const;

/**
 * Category routes for documentation
 */
export const DOC_CATEGORIES = {
  QUICKSTART: 'quickstart',
  HARDWARE: 'hardware',
  PERFORMANCE: 'performance',
  TROUBLESHOOTING: 'troubleshooting',
  LINUX: 'linux',
  WINDOWS: 'windows',
} as const;

export type DocCategory = typeof DOC_CATEGORIES[keyof typeof DOC_CATEGORIES];
