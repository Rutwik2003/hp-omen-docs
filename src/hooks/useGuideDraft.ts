import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../services/draftDatabase';
import { useToast } from '../context/ToastContext';
import { parseError, logError } from '../utils/errorHandling';
import type { GuideDraftData, GuideStep } from '../types/docs';
import type { Block } from '../types/blocks';

/**
 * Counts the total number of words in a guide draft.
 * Extracts text from title, description, step titles, and all block content.
 * HTML tags are stripped before counting.
 * 
 * @param data - The guide draft data to count words from
 * @returns Total word count across all text content
 */
const countWords = (data: GuideDraftData): number => {
    let text = '';
    
    // Extract text from title and description
    text += (data.title || '') + ' ' + (data.description || '') + ' ';
    
    // Extract text from steps and blocks
    if (data.steps) {
        data.steps.forEach((step: GuideStep) => {
            text += (step.title || '') + ' ';
            if (step.blocks) {
                step.blocks.forEach((block: Block) => {
                    if ('content' in block && typeof block.content === 'string') {
                        // Strip HTML tags
                        const stripped = block.content.replace(/<[^>]*>/g, ' ');
                        text += stripped + ' ';
                    }
                });
            }
        });
    }
    
    return text.split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Emergency save function for critical moments (tab close, visibility change, etc.).
 * Persists the current draft to IndexedDB without user feedback.
 * Called synchronously during beforeunload and pagehide events.
 * 
 * @param storageId - Unique identifier for the draft (guide ID or 'new_guide_draft')
 * @param data - The current guide draft data to save
 */
const saveDataSync = async (storageId: string, data: GuideDraftData) => {
    if (!data || !data.title) return;
    
    try {
        const existingDraft = await db.drafts.get(storageId);
        await db.drafts.put({
            id: storageId,
            title: data.title,
            content: data,
            lastModified: Date.now(),
            createdAt: existingDraft?.createdAt || Date.now(),
            stepCount: data.steps?.length || 0,
            wordCount: countWords(data),
            category: data.category || 'Uncategorized'
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[DEV] Emergency save failed', error);
        }
    }
};

/**
 * Hook for managing guide draft persistence with auto-save and offline support.
 * 
 * Features:
 * - Auto-saves every 3 seconds when content changes
 * - Emergency saves on tab close/hide and page unload
 * - Offline detection with automatic save when connection lost
 * - Manual save with user feedback
 * - Draft restoration from IndexedDB
 * 
 * @param guideId - The ID of the guide being edited (or any string for new guides)
 * @param currentData - Current form data to auto-save
 * @param isNew - Whether this is a new guide (uses 'new_guide_draft' as storage key)
 * 
 * @returns Object containing:
 *   - hasDraft: boolean - Whether a saved draft exists
 *   - restoreDraft: () => GuideDraftData | null - Returns saved draft data
 *   - clearDraft: () => Promise<void> - Deletes the saved draft
 *   - saveDraft: () => Promise<boolean> - Manually saves with toast feedback
 *   - forceSave: () => Promise<void> - Immediate save without debounce
 *   - lastSaved: Date | null - Timestamp of last successful save
 *   - isSaving: boolean - Whether a save operation is in progress
 *   - isOnline: boolean - Current network connectivity status
 * 
 * @example
 * const { hasDraft, restoreDraft, saveDraft } = useGuideDraft('guide-123', formData, false);
 * if (hasDraft) {
 *   const restored = restoreDraft();
 *   setFormData(restored);
 * }
 */
export const useGuideDraft = (guideId: string, currentData: GuideDraftData | null, isNew: boolean) => {
    const { addToast } = useToast();
    const [hasDraft, setHasDraft] = useState(false);
    const [draftData, setDraftData] = useState<GuideDraftData | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const autoSaveEnabledRef = useRef(true);
    // Ref to always have the latest data for synchronous event handlers
    const currentDataRef = useRef<GuideDraftData | null>(currentData);
    const storageIdRef = useRef('');

    // Unique ID for draft storage
    // If creating new, use a constant key, otherwise use the edit ID
    const storageId = isNew ? 'new_guide_draft' : guideId;

    // Keep refs updated
    useEffect(() => {
        currentDataRef.current = currentData;
    }, [currentData]);

    useEffect(() => {
        storageIdRef.current = storageId;
    }, [storageId]);

    // Handle online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            addToast('success', 'Back Online', 'Your connection has been restored. Draft will continue auto-saving.');
        };

        const handleOffline = () => {
            setIsOnline(false);
            // Immediately save when going offline
            if (currentDataRef.current?.title) {
                saveDataSync(storageIdRef.current, currentDataRef.current);
                addToast('warning', 'You\'re Offline', 'Don\'t worry! Your draft is saved locally and will sync when you\'re back online.');
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [addToast]);

    // Save when tab becomes hidden or user is about to leave
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && currentDataRef.current?.title) {
                // Save immediately when tab becomes hidden
                saveDataSync(storageIdRef.current, currentDataRef.current);
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (currentDataRef.current?.title) {
                // Save immediately before unload
                saveDataSync(storageIdRef.current, currentDataRef.current);
                
                // Some browsers need this to show a confirmation dialog
                // We'll set it but modern browsers may not show custom messages
                e.preventDefault();
                e.returnValue = '';
            }
        };

        // Also handle page hide (works better on mobile)
        const handlePageHide = () => {
            if (currentDataRef.current?.title) {
                saveDataSync(storageIdRef.current, currentDataRef.current);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, []);

    // Check for existing draft on mount

    // Check for existing draft on mount
    useEffect(() => {
        const checkDraft = async () => {
            try {
                const draft = await db.drafts.get(storageId);
                if (draft) {
                    setDraftData(draft.content);
                    setHasDraft(true);
                    // Note: We don't show a toast here anymore as it's redundant
                    // The "Restore Draft" button in the toolbar is enough indication
                }
            } catch (error) {
                const appError = parseError(error, 'checking for saved drafts');
                logError(appError, 'checkDraft');
                // Don't show toast for draft check failures - not critical
            }
        };

        checkDraft();
    }, [storageId]);

    // Auto-save effect (debounced)
    useEffect(() => {
        if (!currentData || !currentData.title || !autoSaveEnabledRef.current) return;

        const saveTimer = setTimeout(async () => {
            try {
                const existingDraft = await db.drafts.get(storageId);
                await db.drafts.put({
                    id: storageId,
                    title: currentData.title!, // Checked above that title exists
                    content: currentData,
                    lastModified: Date.now(),
                    createdAt: existingDraft?.createdAt || Date.now(),
                    stepCount: currentData.steps?.length || 0,
                    wordCount: countWords(currentData),
                    category: currentData.category || 'Uncategorized'
                });
                setLastSaved(new Date());
                setHasDraft(true);
            } catch (error) {
                const appError = parseError(error, 'auto-saving your draft');
                logError(appError, 'autoSave');
                // Show toast only for storage-full errors (user can take action)
                if (appError.category === 'storage') {
                    addToast('warning', appError.title, appError.action || appError.message);
                }
            }
        }, 3000); // Debounce 3s for auto-save

        return () => clearTimeout(saveTimer);
    }, [currentData, storageId]);

    // Manual save draft function
    const saveDraft = useCallback(async () => {
        if (!currentData || !currentData.title) {
            addToast('error', 'Cannot Save Draft', 'Please enter a title first.');
            return false;
        }

        setIsSaving(true);
        try {
            const existingDraft = await db.drafts.get(storageId);
            await db.drafts.put({
                id: storageId,
                title: currentData.title,
                content: currentData,
                lastModified: Date.now(),
                createdAt: existingDraft?.createdAt || Date.now(),
                stepCount: currentData.steps?.length || 0,
                wordCount: countWords(currentData),
                category: currentData.category || 'Uncategorized'
            });
            setLastSaved(new Date());
            setHasDraft(true);
            addToast('success', 'Draft Saved', 'Your guide has been saved to your browser locally.');
            return true;
        } catch (error) {
            const appError = parseError(error, 'saving your draft');
            logError(appError, 'saveDraft');
            addToast('error', appError.title, appError.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [currentData, storageId, addToast]);

    const restoreDraft = useCallback(() => {
        if (draftData) {
            return draftData;
        }
        return null;
    }, [draftData]);

    const clearDraft = useCallback(async () => {
        await db.drafts.delete(storageId);
        setHasDraft(false);
        setDraftData(null);
    }, [storageId]);

    // Force save function for immediate saves
    const forceSave = useCallback(async () => {
        if (currentData?.title) {
            await saveDataSync(storageId, currentData);
            setLastSaved(new Date());
            setHasDraft(true);
        }
    }, [currentData, storageId]);

    return {
        hasDraft,
        restoreDraft,
        clearDraft,
        saveDraft,
        forceSave,
        lastSaved,
        isSaving,
        isOnline
    };
};
