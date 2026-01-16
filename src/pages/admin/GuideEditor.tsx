import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Eye, Edit2, RotateCcw, Undo, Redo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { fetchAdminContent, saveContent } from '../../utils/adminApi';
import { useToast } from '../../context/ToastContext';
import { useGuideDraft } from '../../hooks/useGuideDraft';
import { useEditorStore } from '../../store/editorStore'; // Import Store
import { migrateStepToBlocks } from '../../utils/blockMigration';

// Components
import { GuideLayout } from '../../components/guide-ui';
import DocRenderer from '../../components/guide-ui/DocRenderer';
import GuideForm from './editor/GuideForm';
import StepEditor from './editor/StepEditor';

import { PLAYGROUND_GUIDE } from '../../data/playgroundData';

interface GuideEditorProps {
  mode?: 'admin' | 'public';
  playground?: boolean;
}

const GuideEditor: React.FC<GuideEditorProps> = ({ mode = 'admin', playground = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  // @ts-ignore
  const { token } = useOutletContext() || {}; 
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Store Hooks
  const guide = useEditorStore((state) => state.guide);
  const setGuide = useEditorStore((state) => state.setGuide);
  const addStep = useEditorStore((state) => state.addStep);
  const reorderSteps = useEditorStore((state) => state.reorderSteps);
  
  const { undo, redo } = useEditorStore.temporal.getState();

  const isNew = !id;
  const isPublic = mode === 'public';

  // Draft System Hook - Adapted to use Store Data
  const { hasDraft, restoreDraft, clearDraft, lastSaved } = useGuideDraft(id || 'new', guide, isNew);

  // Initialize Store
  useEffect(() => {
    if (playground) {
        setGuide(PLAYGROUND_GUIDE);
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
      
      await saveContent(safeId, cleanData(), token);
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
      <div className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
            <button onClick={() => navigate(isPublic ? '/contribute' : '/admin')} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  {playground ? 'Playground Mode' : (isPublic ? 'Community Guide Creator' : (isNew ? 'Create New Guide' : 'Editing Guide'))}
                  {isPreview && <span className="bg-orange-500/20 text-orange-500 text-xs px-2 py-0.5 rounded border border-orange-500/30">PREVIEW MODE</span>}
                  {playground && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded border border-blue-500/30">CHANGES NOT SAVED</span>}
              </h1>
              {lastSaved && !isPublic && !playground && (
                  <span className="text-xs text-neutral-500 block">
                    Last local save: {lastSaved.toLocaleTimeString()}
                  </span>
              )}
            </div>
        </div>

        <div className="flex items-center space-x-3">
             {/* Undo/Redo */}
             {!isPreview && (
                 <div className="flex items-center space-x-1 mr-4 border-r border-white/10 pr-4">
                    <button onClick={() => undo()} className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5" title="Undo"><Undo className="w-4 h-4"/></button>
                    <button onClick={() => redo()} className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5" title="Redo"><Redo className="w-4 h-4"/></button>
                 </div>
             )}

             {/* Restore Draft Button */}
             {hasDraft && !isPublic && !playground && (
                 <button 
                  onClick={handleRestoreDraft}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium text-orange-400 hover:bg-orange-400/10 border border-orange-400/20 transition-all mr-2"
                 >
                    <RotateCcw className="w-4 h-4 mr-2" /> Restore Unsaved
                 </button>
             )}
             
             {playground && (
                  <button 
                    onClick={() => setGuide(PLAYGROUND_GUIDE)}
                    className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all mr-2"
                  >
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset Playground
                  </button>
             )}

             {/* Preview Toggle */}
             <div className="bg-neutral-800 p-1 rounded-lg flex items-center border border-neutral-700">
                <button 
                  onClick={() => setIsPreview(false)}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-all ${!isPreview ? 'bg-neutral-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Edit2 className="w-4 h-4 mr-2" /> Editor
                </button>
                <button 
                  onClick={() => setIsPreview(true)}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-all ${isPreview ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    <Eye className="w-4 h-4 mr-2" /> Preview
                </button>
             </div>

            {!playground && (
                <button 
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${isPublic ? 'bg-blue-600 hover:bg-blue-500' : 'bg-orange-600 hover:bg-orange-500'} text-white shadow-lg shadow-orange-900/20`}
                >
                    {saving ? 'Processing...' : (
                        isPublic ? <><Save className="w-4 h-4 mr-2" /> Export Guide</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                    )}
                </button>
            )}
        </div>
      </div>

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
            className="max-w-[1600px] mx-auto px-8 py-12 space-y-8"
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
