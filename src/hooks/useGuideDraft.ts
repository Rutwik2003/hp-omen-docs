import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/draftDatabase';
import { useToast } from '../context/ToastContext';

export const useGuideDraft = (guideId: string, currentData: any, isNew: boolean) => {
    const { addToast } = useToast();
    const [hasDraft, setHasDraft] = useState(false);
    const [draftData, setDraftData] = useState<any>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Unique ID for draft storage
    // If creating new, use a constant key, otherwise use the edit ID
    const storageId = isNew ? 'new_guide_draft' : guideId;

    // Check for existing draft on mount
    useEffect(() => {
        const checkDraft = async () => {
            try {
                const draft = await db.drafts.get(storageId);
                if (draft) {
                    // You could compare timestamps here if you had server timestamps
                    setDraftData(draft.content);
                    setHasDraft(true);
                    addToast('info', 'Draft Found', 'An unsaved draft was found. You can restore it from the toolbar.');
                }
            } catch (error) {
                console.error('Failed to check drafts', error);
            }
        };

        checkDraft();
    }, [storageId]); // Check only when ID changes (mount / route change)

    // Auto-save effect
    useEffect(() => {
        if (!currentData || !currentData.title) return; // Don't save empty init state

        const saveTimer = setTimeout(async () => {
            try {
                await db.drafts.put({
                    id: storageId,
                    title: currentData.title,
                    content: currentData,
                    lastModified: Date.now()
                });
                setLastSaved(new Date());
            } catch (error) {
                console.error('Auto-save failed', error);
            }
        }, 2000); // Debounce 2s

        return () => clearTimeout(saveTimer);
    }, [currentData, storageId]);

    const restoreDraft = () => {
        if (draftData) {
            return draftData;
        }
        return null;
    };

    const clearDraft = async () => {
        await db.drafts.delete(storageId);
        setHasDraft(false);
        setDraftData(null);
    };

    return {
        hasDraft,
        restoreDraft,
        clearDraft,
        lastSaved
    };
};
