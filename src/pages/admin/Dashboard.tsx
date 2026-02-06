import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useOutletContext } from 'react-router-dom';
import { ExternalLink, FileText, Loader2, LogOut, PanelLeft, Plus, Search, Settings } from 'lucide-react';
import { fetchAdminContent } from '../../utils/adminApi';
import { devError } from '../../utils/logger';

const Dashboard: React.FC = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  // Context from AdminLayout
  const { handleLogout } = useOutletContext<any>();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await fetchAdminContent();
      setGuides(data);
    } catch (error) {
      devError('Failed to load content', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(filter.toLowerCase()) || 
    g.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-gray-400">Manage documentation and system resources.</p>
        </div>
        <div className="flex gap-4">
             <Link to="/" className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all flex items-center">
                 <ExternalLink className="w-4 h-4 mr-2"/> View Site
             </Link>
             <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center">
                 <LogOut className="w-4 h-4 mr-2"/> Logout
             </button>
        </div>
      </div>

      {/* Stats / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div 
           whileHover={{ scale: 1.02 }}
           className="bg-neutral-900/50 border border-orange-500/20 p-6 rounded-2xl relative overflow-hidden group"
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24 text-orange-500" />
             </div>
             <h3 className="text-gray-500 text-sm font-mono mb-1">TOTAL GUIDES</h3>
             <div className="text-4xl font-bold text-white">{guides.length}</div>
        </motion.div>

         <Link to="/admin/new" className="md:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-full bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center cursor-pointer group hover:border-orange-500/50 transition-all"
            >
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-500 rounded-full p-2 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">Create New Guide</span>
                </div>
            </motion.div>
         </Link>

         <Link to="/admin/playground" className="md:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-full bg-neutral-900/50 border border-blue-500/20 rounded-2xl flex items-center justify-center cursor-pointer group hover:border-blue-500/50 transition-all"
            >
                <div className="flex flex-col items-center space-y-2">
                    <div className="bg-blue-500/20 rounded-full p-2 group-hover:bg-blue-500/30 transition-colors">
                        <Settings className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-blue-400 transition-colors">Open Playground</span>
                </div>
            </motion.div>
         </Link>
      </div>

      {/* Sidebar Config Card */}
      <div className="mb-12">
        <Link to="/admin/sidebar">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-neutral-900/50 border border-purple-500/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer group hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/20 rounded-xl p-3 group-hover:bg-purple-500/30 transition-colors">
                <PanelLeft className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Sidebar Configuration</h3>
                <p className="text-sm text-gray-500">Customize navigation items, order, and visibility</p>
              </div>
            </div>
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
          </motion.div>
        </Link>
      </div>

      {/* Filter */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search guides by title or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, idx) => {
                // Ensure unique key for React and Framer Motion
                const uniqueKey = `${guide.id}-${idx}`;
                return (
                <Link key={uniqueKey} to={`/admin/edit/${encodeURIComponent(guide.id)}`}>
                    <motion.div 
                       layoutId={uniqueKey}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.2 }}
                       className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all group h-full flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-mono border ${
                                guide.category === 'Quick Start' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                guide.category === 'Production' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                'bg-gray-800 text-gray-400 border-gray-700'
                            }`}>
                                {guide.category}
                            </span>
                            <Settings className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">{guide.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">{guide.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-600 font-mono">
                            <span>{guide.id.split('.json')[0]}</span>
                        </div>
                    </motion.div>
                </Link>
            )})}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
