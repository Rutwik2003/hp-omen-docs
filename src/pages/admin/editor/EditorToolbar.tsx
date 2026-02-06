import React from 'react';
import { ArrowLeft, Edit2, Eye, Redo, RotateCcw, Save, Undo, Wifi, WifiOff } from 'lucide-react';

interface EditorToolbarProps {
  // Navigation
  onBack: () => void;
  
  // Mode & State
  isPublic: boolean;
  isNew: boolean;
  isPreview: boolean;
  playground: boolean;
  
  // Draft State
  hasDraft: boolean;
  lastSaved: Date | null;
  isDraftSaving: boolean;
  isOnline: boolean;
  
  // Save State
  saving: boolean;
  
  // Actions
  onUndo: () => void;
  onRedo: () => void;
  onRestoreDraft: () => void;
  onResetPlayground: () => void;
  onTogglePreview: (preview: boolean) => void;
  onSaveDraft: () => void;
  onSave: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onBack,
  isPublic,
  isNew,
  isPreview,
  playground,
  hasDraft,
  lastSaved,
  isDraftSaving,
  isOnline,
  saving,
  onUndo,
  onRedo,
  onRestoreDraft,
  onResetPlayground,
  onTogglePreview,
  onSaveDraft,
  onSave,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur border-b border-white/10 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-md">
      {/* Top Row - Title and Nav */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button 
            onClick={onBack} 
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="truncate">
                {playground ? 'Playground Mode' : (isPublic ? 'Community Guide Creator' : (isNew ? 'Create New Guide' : 'Editing Guide'))}
              </span>
              {isPreview && (
                <span className="bg-orange-500/20 text-orange-500 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded border border-orange-500/30 shrink-0">
                  PREVIEW MODE
                </span>
              )}
              {playground && (
                <span className="bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded border border-blue-500/30 shrink-0">
                  CHANGES NOT SAVED
                </span>
              )}
            </h1>
            {!playground && (
              <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                {/* Online/Offline Status */}
                <span className={`flex items-center gap-1 ${isOnline ? 'text-green-500' : 'text-red-400'}`}>
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3" />
                      <span className="hidden sm:inline">Auto-saving</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span className="hidden sm:inline">Offline</span>
                    </>
                  )}
                </span>
                {lastSaved && (
                  <span className="text-neutral-500">
                    · Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls - Right Side */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          {/* Undo/Redo - Hidden on very small screens */}
          {!isPreview && (
            <div className="hidden sm:flex items-center gap-1 mr-2 lg:mr-4 border-r border-white/10 pr-2 lg:pr-4">
              <button 
                onClick={onUndo} 
                className="p-1 sm:p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5" 
                title="Undo"
              >
                <Undo className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
              </button>
              <button 
                onClick={onRedo} 
                className="p-1 sm:p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5" 
                title="Redo"
              >
                <Redo className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
              </button>
            </div>
          )}

          {/* Restore Draft Button - Always visible when draft exists */}
          {hasDraft && !isPublic && !playground && (
            <button 
              onClick={onRestoreDraft}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center text-xs sm:text-sm font-medium text-orange-400 hover:bg-orange-400/10 border border-orange-400/20 transition-all animate-pulse"
              title="Restore Unsaved Draft"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="sm:hidden">Restore</span>
              <span className="hidden sm:inline">Restore Unsaved</span>
            </button>
          )}
          
          {playground && (
            <button 
              onClick={onResetPlayground}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-md flex items-center text-xs sm:text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              title="Reset Playground"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Reset Playground</span>
            </button>
          )}

          {/* Preview Toggle */}
          <div className="bg-neutral-800 p-0.5 sm:p-1 rounded-lg flex items-center border border-neutral-700">
            <button 
              onClick={() => onTogglePreview(false)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center text-xs sm:text-sm font-medium transition-all ${!isPreview ? 'bg-neutral-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-1.5 sm:ml-0">Editor</span>
            </button>
            <button 
              onClick={() => onTogglePreview(true)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center text-xs sm:text-sm font-medium transition-all ${isPreview ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-1.5 sm:ml-0">Preview</span>
            </button>
          </div>

          {/* Save Draft Button - For public/community mode (saves to browser) */}
          {isPublic && !playground && (
            <button 
              onClick={onSaveDraft}
              disabled={isDraftSaving}
              className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors disabled:opacity-50"
              title="Save Draft to Browser"
            >
              {isDraftSaving ? (
                <svg className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">{isDraftSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          )}

          {!playground && (
            <button 
              onClick={onSave}
              disabled={saving}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 ${isPublic ? 'bg-blue-600 hover:bg-blue-500' : 'bg-orange-600 hover:bg-orange-500'} text-white shadow-lg shadow-orange-900/20`}
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline ml-1.5 sm:ml-0">
                {saving ? 'Processing...' : (isPublic ? 'Export Guide' : 'Save Changes')}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
