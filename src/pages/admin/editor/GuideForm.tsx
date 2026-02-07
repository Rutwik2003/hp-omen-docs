import CustomSelect from '../../../components/ui/CustomSelect';
import { useEditorStore } from '../../../store/editorStore';
import { Difficulty } from '../../../types/docs';
import { useShallow } from 'zustand/react/shallow';

interface MetadataUpdate {
  difficulty?: Difficulty;
  readTime?: string;
  lastUpdated?: string;
  tags?: string[];
}

const GuideForm = () => {
  const { guide, setGuide } = useEditorStore(useShallow((s) => ({ guide: s.guide, setGuide: s.setGuide })));
  
  const updateGuide = (fields: Partial<typeof guide>) => {
      setGuide({ ...guide, ...fields });
  };
  
  const updateMetadata = (fields: MetadataUpdate) => {
      setGuide({ 
          ...guide, 
          metadata: { ...guide.metadata, ...fields } 
      });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6" role="form" aria-label="Guide metadata form">
        <h3 className="text-orange-500 font-mono text-xs uppercase tracking-wider border-b border-orange-500/20 pb-2">General Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <label htmlFor="guide-title" className="block text-gray-400 text-sm mb-2 font-medium">Guide Title</label>
                <input 
                    id="guide-title"
                    value={guide.title || ''}
                    onChange={e => updateGuide({ title: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-all focus:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    placeholder="e.g., Ultimate Performance Guide"
                    aria-required="true"
                />
            </div>
            <div className="col-span-1 md:col-span-2">
                <label htmlFor="guide-description" className="block text-gray-400 text-sm mb-2 font-medium">Description</label>
                <textarea 
                    id="guide-description"
                    value={guide.description || ''}
                    onChange={e => updateGuide({ description: e.target.value })}
                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none h-24 transition-all"
                    placeholder="Briefly describe what this guide covers..."
                />
            </div>

            <div>
                <CustomSelect 
                    label="Category"
                    value={guide.category || 'Quick Start'}
                    onChange={(val) => updateGuide({ category: val })}
                    options={[
                        { label: 'Quick Start', value: 'Quick Start' },
                        { label: 'Windows', value: 'Windows' },
                        { label: 'Performance', value: 'Performance' },
                        { label: 'Hardware', value: 'Hardware' },
                        { label: 'Troubleshooting', value: 'Troubleshooting' },
                        { label: 'Drivers', value: 'Drivers' }
                    ]}
                />
            </div>
            <div>
                <CustomSelect 
                    label="Difficulty"
                    value={guide.metadata?.difficulty || 'Beginner'}
                    onChange={(val) => updateMetadata({ difficulty: val })}
                    options={[
                        { label: 'Beginner', value: 'Beginner' },
                        { label: 'Intermediate', value: 'Intermediate' },
                        { label: 'Advanced', value: 'Advanced' }
                    ]}
                />
            </div>
        </div>
    </div>
  );
};

export default GuideForm;
