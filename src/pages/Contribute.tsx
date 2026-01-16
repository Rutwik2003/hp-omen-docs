import React from 'react';
import { GuideLayout, StepSection, InfoBox } from '../components/guide-ui';
import { GitPullRequest, Edit, Github } from 'lucide-react';

const Contribute: React.FC = () => {
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: The Public Creator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors group">
            <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <Edit className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create a Guide</h3>
            <p className="text-gray-400 text-sm mb-6 h-20">
              Use our visual tool to draft a new guide. It runs right in your browser. When you're done, export it and send it to us!
            </p>
            <div className="flex flex-col space-y-2">
                <a 
                href="/contribute/new" 
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:from-orange-500 hover:to-red-500 transition-all"
                >
                Start Writing <Edit className="ml-2 h-4 w-4" />
                </a>
                <a 
                href="/contribute/playground" 
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-neutral-800 text-neutral-400 text-sm hover:text-white rounded-lg hover:bg-neutral-700 transition-all"
                >
                Try the Playground
                </a>
            </div>
          </div>

          {/* Option 2: GitHub Direct */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors group">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Github className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">GitHub Power User?</h3>
            <p className="text-gray-400 text-sm mb-6 h-20">
              Prefer raw Markdown? Fork our repository, make your changes in `src/content/`, and open a Pull Request directly.
            </p>
            <a 
              href="https://github.com/rutwi123/hp-omen-reborn" 
              target="_blank"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 transition-all"
            >
              View Repository <GitPullRequest className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>

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
    </GuideLayout>
  );
};

export default Contribute;
