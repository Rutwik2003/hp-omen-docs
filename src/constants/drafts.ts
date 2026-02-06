/**
 * Draft ID constants for the guide editor
 * Used to identify different draft types in IndexedDB storage
 */
export const DRAFT_IDS = {
  /** Draft ID for public/contributor new guides */
  PUBLIC_NEW: 'public_new_draft',
  /** Draft ID for admin new guides */
  ADMIN_NEW: 'admin_new_draft',
} as const;

export type DraftId = typeof DRAFT_IDS[keyof typeof DRAFT_IDS];
