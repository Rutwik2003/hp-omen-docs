import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { fetchAdminContent, saveContent } from '../../utils/adminApi';
import { useToast } from '../../context/ToastContext';
import { useGuideDraft } from '../../hooks/useGuideDraft';
import { useEditorStore } from '../../store/editorStore';
import { migrateStepToBlocks } from '../../utils/blockMigration';
import { DRAFT_IDS } from '../../constants';

// Components
import { GuideLayout } from '../../components/guide-ui';
import DocRenderer from '../../components/guide-ui/DocRenderer';
import GuideForm from './editor/GuideForm';
import StepEditor from './editor/StepEditor';
import EditorToolbar from './editor/EditorToolbar';

import { PLAYGROUND_GUIDE } from '../../data/playgroundData';

interface GuideEditorProps {
  mode?: 'admin' | 'public';
  playground?: boolean;
}

// Type for admin outlet context
interface AdminOutletContext {
  token: string | null;
}

const GuideEditor: React.FC<GuideEditorProps> = ({ mode = 'admin', playground = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token } = (useOutletContext() as AdminOutletContext | null) || { token: null }; 
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Force layout recalculation on mount (fixes responsive issues when navigating from DocsLayout)
  useLayoutEffect(() => {
    // Trigger a resize event to force CSS media queries to recalculate
    window.dispatchEvent(new Event('resize'));
  }, []);

  // Store Hooks
  const guide = useEditorStore((state) => state.guide);
  const setGuide = useEditorStore((state) => state.setGuide);
  const addStep = useEditorStore((state) => state.addStep);
  const reorderSteps = useEditorStore((state) => state.reorderSteps);
  
  const { undo, redo } = useEditorStore.temporal.getState();

  const isNew = !id;
  const isPublic = mode === 'public';
  
  // Determine the storage ID for drafts
  // For public mode: use the ID from URL if editing a draft, or use 'public_new_draft' for new drafts
  // For admin mode: use the ID from URL if editing, or use 'admin_new_draft' for new drafts
  const draftStorageId = id 
    ? decodeURIComponent(id) 
    : (isPublic ? DRAFT_IDS.PUBLIC_NEW : DRAFT_IDS.ADMIN_NEW);

  // Draft System Hook - Adapted to use Store Data
  const { hasDraft, restoreDraft, clearDraft, saveDraft, lastSaved, isSaving: isDraftSaving, isOnline } = useGuideDraft(draftStorageId, guide, isNew && !isPublic);

  // Load draft from IndexedDB for public edit mode
  const loadDraftFromDB = async (draftId: string) => {
    setLoading(true);
    try {
      const { db } = await import('../../services/draftDatabase');
      const draft = await db.drafts.get(draftId);
      console.log('Loading draft:', draftId, draft); // Debug log
      if (draft && draft.content) {
        setGuide(draft.content);
        // Only show success toast if this is not a silent reload
        if (!guide.title) {
          addToast('success', 'Draft Loaded', 'Your saved draft has been restored.');
        }
      } else {
        // Draft not found - redirect with error message
        addToast('error', 'Draft Not Found', 'This draft no longer exists. It may have been deleted.');
        navigate('/contribute', { replace: true });
      }
    } catch (error) {
      console.error('Failed to load draft', error);
      addToast('error', 'Load Failed', 'Could not load draft from browser storage.');
      navigate('/contribute', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // Initialize Store
  useEffect(() => {
    if (playground) {
        setGuide(PLAYGROUND_GUIDE);
    } else if (isPublic && id) {
        // Public mode with ID = editing a draft from IndexedDB
        loadDraftFromDB(decodeURIComponent(id));
    } else if (isNew) {
        setGuide({
            title: '',
            description: '',
            category: 'Quick Start',
            metadata: {
                difficulty: 'Beginner',
                readTime: '5 min',
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            },
            steps: []
        });
    } else if (!isPublic && id) {
      loadGuide(decodeURIComponent(id));
    }
  }, [id, isPublic, isNew, playground]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const loadGuide = async (guideId: string) => {
    setLoading(true);
    try {
      const allDocs = await fetchAdminContent();
      const doc = allDocs.find((d: any) => d.id === guideId);
      if (doc) {
        // Hydrate steps with blocks if missing (Migration)
        const hydratedSteps = (doc.steps || []).map((s: any) => ({
            ...s,
            id: s.id || generateId(),
            blocks: migrateStepToBlocks(s) // MIGRATE LEGACY DATA
        }));
        setGuide({ ...doc, steps: hydratedSteps });
      }
    } catch (e) {
      console.error(e);
      addToast('error', 'Failed to load guide', 'Could not fetch guide content.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) {
      setGuide(draft);
      addToast('success', 'Draft Restored', 'Your unsaved changes have been restored.');
    }
  };

  const cleanData = () => {
     // Prepare for Save
     const cleanSteps = (guide.steps || []).map((step: any) => {
         // Create a text representation of blocks for search/legacy if needed?
         // For now, we save everything.
         // We might want to remove 'content' string if we rely fully on blocks, 
         // but keeping it as a fallback description or concatenation of text blocks is nice for SEO/Search.
         const fallbackContent = step.blocks
            ?.filter((b:any) => b.type === 'text')
            .map((b:any) => b.content)
            .join(' ') || '';

         return {
             ...step,
             content: fallbackContent, // Update legacy content field just in case
         };
     });
     
     return {
        ...guide,
        path: `/docs/${(guide.category || 'misc').toLowerCase().replace(/\s+/g,'')}/${(guide.title || 'untitled').toLowerCase().replace(/\s+/g,'-')}`,
        steps: cleanSteps
      };
  };

  const handleSave = async () => {
    if (!guide.title) return addToast('error', 'Missing Title', 'Please enter a title for the guide.' );

    if (isPublic) {
        // Public Mode: Download JSON
        const data = cleanData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${guide.title.toLowerCase().replace(/\s+/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast('success', 'Guide Exported', 'Please share this JSON file with the maintainers.');
        return;
    }

    // Admin Mode: Save to Server
    setSaving(true);
    try {
      const safeId = isNew 
        ? `${(guide.category || 'misc').toLowerCase().replace(/\s+/g, '')}/${guide.title.toLowerCase().replace(/\s+/g, '-')}.json` 
        : id!;
      
      await saveContent(safeId, cleanData(), token ?? undefined);
      await clearDraft(); // Clear draft on successful save
      addToast('success', 'Changes Saved', 'Your guide has been successfully updated.');
      if (isNew) navigate('/admin');
    } catch (e) {
      addToast('error', 'Save Failed', String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !guide.steps) return;
    
    const items = Array.from(guide.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    reorderSteps(items);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Toolbar */}
      <EditorToolbar
        onBack={() => navigate(isPublic ? '/contribute' : '/admin')}
        isPublic={isPublic}
        isNew={isNew}
        isPreview={isPreview}
        playground={playground}
        hasDraft={hasDraft}
        lastSaved={lastSaved}
        isDraftSaving={isDraftSaving}
        isOnline={isOnline}
        saving={saving}
        onUndo={() => undo()}
        onRedo={() => redo()}
        onRestoreDraft={handleRestoreDraft}
        onResetPlayground={() => setGuide(PLAYGROUND_GUIDE)}
        onTogglePreview={setIsPreview}
        onSaveDraft={saveDraft}
        onSave={handleSave}
      />

      <AnimatePresence mode="wait">
      {isPreview ? (
        // PREVIEW MODE (WYSIWYG)
        <motion.div 
          key="preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-black"
        >
             <GuideLayout 
                title={guide.title || 'Untitled Guide'}
                description={guide.description || 'No description provided.'}
                metadata={guide.metadata as any}
                breadcrumbs={[
                    { label: guide.category || 'Category', path: '#' },
                    { label: guide.title || 'Preview' }
                ]}
             >
                {/* Use the shared renderer for identical output */}
                <DocRenderer data={guide} />
             </GuideLayout>
        </motion.div>
      ) : (
        // EDITOR MODE
        <motion.div 
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-6 sm:space-y-8"
        >
          {/* Metadata Form - Now uses global store inside, but we can pass wrapper if needed? 
              Actually let's update GuideForm to use store too so we don't pass props.
           */}
          <GuideForm />

          {/* Steps Builder */}
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h3 className="text-orange-500 font-mono text-xs uppercase tracking-wider">Step By Step Instructions</h3>
                  <button onClick={addStep} className="text-sm text-gray-400 hover:text-white flex items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
                      <Plus className="w-4 h-4 mr-1" /> Add Step
                  </button>
              </div>

               {/* DRAG AND DROP LIST */}
               <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="guide-steps">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className="flex flex-col space-y-6"
                        >
                            {(guide.steps || []).map((step: any, idx) => (
                                <StepEditor 
                                    key={step.id} 
                                    step={{...step, id: step.id}} 
                                    index={idx}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                  </Droppable>
              </DragDropContext>
              
              <button onClick={addStep} className="w-full py-6 border-2 border-dashed border-neutral-800 rounded-xl text-gray-500 hover:border-orange-500/50 hover:text-orange-500 hover:bg-orange-500/5 transition-all flex items-center justify-center group">
                  <div className="bg-neutral-800 p-2 rounded-full mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Add New Step</span>
              </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default GuideEditor;
