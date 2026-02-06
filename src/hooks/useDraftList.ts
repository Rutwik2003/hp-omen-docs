import { useCallback, useEffect, useState } from 'react';
import { db, DraftGuide } from '../services/draftDatabase';
import { logError, parseError } from '../utils/errorHandling';

/**
 * Hook for managing the list of saved drafts in IndexedDB.
 * Provides CRUD operations for drafts with loading states.
 * 
 * @returns Object containing:
 *   - drafts: DraftGuide[] - Array of all saved drafts, sorted by lastModified
 *   - loading: boolean - Whether drafts are being loaded
 *   - loadDrafts: () => Promise<void> - Refresh the draft list
 *   - deleteDraft: (id: string) => Promise<boolean> - Delete a specific draft
 *   - clearAllDrafts: () => Promise<boolean> - Delete all drafts
 *   - getDraft: (id: string) => Promise<DraftGuide | undefined> - Get a specific draft
 *   - hasDrafts: boolean - Quick check if any drafts exist
 *   - error: string | null - Error message if load failed
 * 
 * @example
 * const { drafts, deleteDraft, loading } = useDraftList();
 * if (!loading && drafts.length > 0) {
 *   // Show draft list UI
 * }
 */
export const useDraftList = () => {
    const [drafts, setDrafts] = useState<DraftGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDrafts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allDrafts = await db.getAllDrafts();
            setDrafts(allDrafts);
        } catch (err) {
            const appError = parseError(err, 'loading your drafts');
            logError(appError, 'loadDrafts');
            setError(appError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDrafts();
    }, [loadDrafts]);

    const deleteDraft = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await db.drafts.delete(id);
            setDrafts(prev => prev.filter(d => d.id !== id));
            return { success: true };
        } catch (err) {
            const appError = parseError(err, 'deleting the draft');
            logError(appError, 'deleteDraft');
            return { success: false, error: appError.message };
        }
    }, []);

    const clearAllDrafts = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        try {
            await db.drafts.clear();
            setDrafts([]);
            return { success: true };
        } catch (err) {
            const appError = parseError(err, 'clearing all drafts');
            logError(appError, 'clearAllDrafts');
            return { success: false, error: appError.message };
        }
    }, []);

    const getDraft = useCallback(async (id: string): Promise<DraftGuide | undefined> => {
        try {
            return await db.drafts.get(id);
        } catch (err) {
            const appError = parseError(err, 'retrieving the draft');
            logError(appError, 'getDraft');
            return undefined;
        }
    }, []);

    return {
        drafts,
        loading,
        error,
        loadDrafts,
        deleteDraft,
        clearAllDrafts,
        getDraft,
        hasDrafts: drafts.length > 0
    };
};
