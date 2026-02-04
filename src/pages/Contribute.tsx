import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GuideLayout, StepSection, InfoBox } from '../components/guide-ui';
import { GitPullRequest, Edit, Github, Clock, FileText, Trash2, ChevronRight, Loader2, AlertTriangle, X } from 'lucide-react';
import { useDraftList } from '../hooks/useDraftList';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to format relative time
const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
};

// Custom Delete Confirmation Modal
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  draftTitle,
  isDeleting 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  draftTitle: string;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container - Full screen flex centering */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Delete Draft</h3>
                  </div>
                  <button 
                    onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-6">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete this draft?
                </p>
                <p className="text-sm text-gray-500 bg-neutral-800/50 px-3 py-2 rounded-lg truncate">
                  "{draftTitle || 'Untitled Draft'}"
                </p>
                <p className="text-xs text-red-400/80 mt-3">
                  This action cannot be undone.
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 p-4 bg-neutral-950/50 border-t border-neutral-800">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const Contribute: React.FC = () => {
  const { drafts, loading, deleteDraft, hasDrafts } = useDraftList();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const openDeleteModal = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id, title });
  };

  const closeDeleteModal = () => {
    if (!deletingId) {
      setDeleteModal({ isOpen: false, id: '', title: '' });
    }
  };

  const confirmDelete = async () => {
    setDeletingId(deleteModal.id);
    await deleteDraft(deleteModal.id);
    setDeletingId(null);
    setDeleteModal({ isOpen: false, id: '', title: '' });
  };

  // Helper to get the correct edit URL for a draft
  const getDraftEditUrl = (draftId: string) => {
    // All drafts go to /contribute/edit/:id - the editor will load from IndexedDB
    return `/contribute/edit/${encodeURIComponent(draftId)}`;
  };

  return (
    <GuideLayout
      title="Contribute to OMEN Docs"
      description="Help us build the ultimate resource for HP OMEN users. Add guides, fix errors, or share your optimization tweaks."
      breadcrumbs={[{ label: 'Contribute' }]}
      metadata={{
        readTime: "2 min read",
        difficulty: "Beginner",
        lastUpdated: "Today"
      }}
    >
      <div className="space-y-8">
        <InfoBox 
          type="info"
          title="How it works"
        >
          We use a transparent 'Editorial Workflow'. You don't need permission to submit! Your changes will be saved as a 'Draft' for our admins to review before going live.
        </InfoBox>



        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Option 1: The Public Creator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 hover:border-orange-500/50 transition-colors group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500/20 transition-colors">
              <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Create a Guide</h3>
            <p className="text-gray-400 text-sm mb-4 sm:mb-6 min-h-[60px] sm:h-20">
              Use our visual tool to draft a new guide. It runs right in your browser. When you're done, export it and send it to us!
            </p>
            <div className="flex flex-col space-y-2">
                <Link 
                to="/contribute/new" 
                className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:from-orange-500 hover:to-red-500 transition-all text-sm sm:text-base"
                >
                Start Writing <Edit className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                to="/contribute/playground" 
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-neutral-800 text-neutral-400 text-sm hover:text-white rounded-lg hover:bg-neutral-700 transition-all"
                >
                Try the Playground
                </Link>
            </div>
          </div>

          {/* Option 2: GitHub Direct */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-colors group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Github className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">GitHub Power User?</h3>
            <p className="text-gray-400 text-sm mb-4 sm:mb-6 min-h-[60px] sm:h-20">
              Prefer raw Markdown? Fork our repository, make your changes in `src/content/`, and open a Pull Request directly.
            </p>
            <a 
              href="https://github.com/rutwi123/hp-omen-reborn" 
              target="_blank"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:py-2 bg-neutral-800 text-white border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 transition-all text-sm sm:text-base"
            >
              View Repository <GitPullRequest className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Your Drafts Section */}
        {(hasDrafts || loading) && (
          <section className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Your Drafts</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Saved locally in your browser</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {drafts.length > 5 && (
                    <span className="text-[10px] sm:text-xs text-gray-500">Scroll for more</span>
                  )}
                  {hasDrafts && (
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-1 rounded-full">
                      {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="divide-y divide-neutral-800/50 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading drafts...</p>
                  </div>
                ) : (
                drafts.map((draft) => (
                  <Link
                    key={draft.id}
                    to={getDraftEditUrl(draft.id)}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-white truncate group-hover:text-orange-400 transition-colors">
                        {draft.title || 'Untitled Draft'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(draft.lastModified)}
                        </span>
                        {draft.category && (
                          <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-gray-400">
                            {draft.category}
                          </span>
                        )}
                        {draft.stepCount !== undefined && draft.stepCount > 0 && (
                          <span>{draft.stepCount} {draft.stepCount === 1 ? 'step' : 'steps'}</span>
                        )}
                        {draft.wordCount !== undefined && draft.wordCount > 0 && (
                          <span className="hidden sm:inline">~{draft.wordCount} words</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => openDeleteModal(draft.id, draft.title, e)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete draft"
                      >
                        {deletingId === draft.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </Link>
                ))
              )}
              </div>
              {/* Fade gradient at bottom when scrollable */}
              {drafts.length > 5 && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
              )}
            </div>

            {hasDrafts && (
              <div className="p-3 sm:p-4 bg-neutral-950/50 border-t border-neutral-800">
                <Link
                  to="/contribute/new"
                  className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Start a new guide
                </Link>
              </div>
            )}
          </section>
        )}


        <StepSection number={1} title="Choose a Topic">
          <p className="text-gray-300 mb-4">
            We are looking for guides on:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
            <li>Game-specific optimization configs (e.g., "Best Warzone Settings for Omen 16")</li>
            <li>Linux installation walkthroughs (Ubuntu, Arch, Fedora)</li>
            <li>Hardware upgrade photo-guides (SSD, RAM swap)</li>
            <li>Troubleshooting niche driver bugs</li>
          </ul>
        </StepSection>

        <StepSection number={2} title="Structure Your Guide">
           <p className="text-gray-300 mb-4">
            If you use the <strong>Visual Editor</strong>, it will handle the formatting for you. 
            If you write manually, please follow our standard JSON structure:
          </p>
          <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 font-mono border border-neutral-800">
{`{
  "title": "Your Guide Title",
  "steps": [
    {
      "title": "Step 1: Preparation",
      "content": "Description of what to do..."
    }
  ]
}`}
          </pre>
        </StepSection>

        <section className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Discord Community</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The fastest way to contribute or get help is to join our active Discord server. Discuss ideas, report bugs, or chat with other OMEN users.
          </p>
          <div className="flex justify-center space-x-4">
             <a href="https://discord.gg/hpomen" target="_blank" className="inline-flex items-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-bold transition-all">
               <svg className="w-5 h-5 mr-2" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.82,105.82,0,0,0,126.6,80.22c2.36-24.44-2.54-46.12-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
               Join Discord
             </a>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        draftTitle={deleteModal.title}
        isDeleting={deletingId === deleteModal.id}
      />
    </GuideLayout>
  );
};

export default Contribute;
