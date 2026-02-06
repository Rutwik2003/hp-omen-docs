import React, { useCallback, useState } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Edit2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AVAILABLE_ICONS,
  exportSidebarConfig,
  getSidebarConfig,
  importSidebarConfig,
  resetSidebarConfig,
  saveSidebarConfig,
  SidebarConfig,
  SidebarItem,
} from '../../data/sidebarConfig';

// Draggable Item Component
const DraggableItem: React.FC<{
  item: SidebarItem;
  onUpdate: (id: string, updates: Partial<SidebarItem>) => void;
  onDelete: (id: string) => void;
}> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editHref, setEditHref] = useState(item.href);
  const [editIcon, setEditIcon] = useState(item.icon);
  const [expanded, setExpanded] = useState(false);
  const dragControls = useDragControls();

  const IconComponent = AVAILABLE_ICONS[item.icon] || AVAILABLE_ICONS.Home;

  const handleSave = () => {
    onUpdate(item.id, { name: editName, href: editHref, icon: editIcon });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditHref(item.href);
    setEditIcon(item.icon);
    setIsEditing(false);
  };

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="mb-2"
    >
      <motion.div
        layout
        className={`bg-neutral-900 border rounded-xl overflow-hidden transition-colors ${
          item.visible ? 'border-neutral-700' : 'border-neutral-800 opacity-60'
        }`}
      >
        {/* Main row */}
        <div className="flex items-center p-3 gap-3">
          {/* Drag handle */}
          <button
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300 touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-orange-400" />
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-2 py-1 text-white text-sm focus:border-orange-500 focus:outline-none"
                placeholder="Name"
              />
              <input
                type="text"
                value={editHref}
                onChange={(e) => setEditHref(e.target.value)}
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-2 py-1 text-white text-sm focus:border-orange-500 focus:outline-none"
                placeholder="/path"
              />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{item.name}</div>
              <div className="text-xs text-gray-500 truncate">{item.href}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:bg-gray-500/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onUpdate(item.id, { visible: !item.visible })}
                  className={`p-2 rounded-lg transition-colors ${
                    item.visible 
                      ? 'text-green-400 hover:bg-green-500/10' 
                      : 'text-gray-500 hover:bg-gray-500/10'
                  }`}
                >
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expanded options */}
        {expanded && !isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 border-t border-neutral-800"
          >
            <div className="pt-4 space-y-4">
              {/* Icon selector */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                    <button
                      key={name}
                      onClick={() => onUpdate(item.id, { icon: name })}
                      className={`p-2 rounded-lg border transition-colors ${
                        item.icon === name
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                          : 'bg-neutral-800 border-neutral-700 text-gray-400 hover:border-gray-600'
                      }`}
                      title={name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category info */}
              {item.category && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <div className="text-sm text-gray-400 bg-neutral-800 px-3 py-2 rounded-lg">
                    {item.category} <span className="text-gray-600">(sub-items loaded automatically)</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Reorder.Item>
  );
};

// Add New Item Modal
const AddItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<SidebarItem, 'id' | 'order'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [href, setHref] = useState('');
  const [icon, setIcon] = useState('Home');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && href) {
      onAdd({
        name,
        href,
        icon,
        visible: true,
        category: category || undefined,
      });
      setName('');
      setHref('');
      setIcon('Home');
      setCategory('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-6">Add Sidebar Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              placeholder="My Page"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Path (href)</label>
            <input
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              placeholder="/my-page"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category (optional)</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              placeholder="quickstart, windows, etc."
            />
            <p className="text-xs text-gray-600 mt-1">If set, sub-items will be loaded from this category</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AVAILABLE_ICONS).map(([iconName, Icon]) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`p-2 rounded-lg border transition-colors ${
                    icon === iconName
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                      : 'bg-neutral-800 border-neutral-700 text-gray-400 hover:border-gray-600'
                  }`}
                  title={iconName}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-800 text-gray-400 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Component
const SidebarConfigurator: React.FC = () => {
  const [config, setConfig] = useState<SidebarConfig>(getSidebarConfig());
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle reorder
  const handleReorder = useCallback((newItems: SidebarItem[]) => {
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    setConfig(prev => ({ ...prev, items: updatedItems }));
    setHasChanges(true);
  }, []);

  // Handle item update
  const handleUpdateItem = useCallback((id: string, updates: Partial<SidebarItem>) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    setHasChanges(true);
  }, []);

  // Handle item delete
  const handleDeleteItem = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setConfig(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }));
      setHasChanges(true);
    }
  }, []);

  // Handle add item
  const handleAddItem = useCallback((newItem: Omit<SidebarItem, 'id' | 'order'>) => {
    const id = `custom-${Date.now()}`;
    const order = config.items.length;
    setConfig(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, id, order }],
    }));
    setHasChanges(true);
  }, [config.items.length]);

  // Save config
  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    saveSidebarConfig(config);
    setHasChanges(false);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [config]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    if (confirm('Reset sidebar to default configuration? This will remove all customizations.')) {
      const defaultConfig = resetSidebarConfig();
      setConfig(defaultConfig);
      setHasChanges(false);
    }
  }, []);

  // Export config
  const handleExport = useCallback(() => {
    exportSidebarConfig(config);
  }, [config]);

  // Import config
  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedConfig = await importSidebarConfig(file);
        setConfig(importedConfig);
        setHasChanges(false);
      } catch (error) {
        alert('Failed to import configuration. Please check the file format.');
      }
    }
    e.target.value = '';
  }, []);

  // Update footer settings
  const handleUpdateFooter = useCallback((
    section: 'discord' | 'branding',
    key: string,
    value: string | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [section]: {
          ...prev.footerLinks[section],
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Sidebar Configuration</h1>
                <p className="text-sm text-gray-500">Customize navigation items and order</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <span className="text-xs text-orange-400 mr-2">Unsaved changes</span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  hasChanges
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-orange-500/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-red-500/50 text-gray-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-blue-500/50 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-green-500/50 text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Sidebar items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Navigation Items</h2>
          <p className="text-sm text-gray-500 mb-4">Drag items to reorder. Click the expand arrow to customize.</p>
          
          <Reorder.Group
            axis="y"
            values={config.items}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {config.items.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </Reorder.Group>
        </div>

        {/* Footer settings */}
        <div className="border-t border-neutral-800 pt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Footer Settings</h2>
          
          {/* Discord */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Discord Link</h3>
              <button
                onClick={() => handleUpdateFooter('discord', 'visible', !config.footerLinks.discord.visible)}
                className={`p-2 rounded-lg transition-colors ${
                  config.footerLinks.discord.visible
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-gray-500 bg-neutral-800'
                }`}
              >
                {config.footerLinks.discord.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={config.footerLinks.discord.label}
                onChange={(e) => handleUpdateFooter('discord', 'label', e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                placeholder="Label"
              />
              <input
                type="text"
                value={config.footerLinks.discord.url}
                onChange={(e) => handleUpdateFooter('discord', 'url', e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                placeholder="Discord URL"
              />
            </div>
          </div>

          {/* Branding */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="font-medium text-white mb-4">Branding</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={config.footerLinks.branding.title}
                  onChange={(e) => handleUpdateFooter('branding', 'title', e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={config.footerLinks.branding.subtitle}
                  onChange={(e) => handleUpdateFooter('branding', 'subtitle', e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tagline</label>
                <input
                  type="text"
                  value={config.footerLinks.branding.tagline}
                  onChange={(e) => handleUpdateFooter('branding', 'tagline', e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Config info */}
        <div className="mt-8 p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Version: {config.version}</span>
            <span>Last updated: {new Date(config.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default SidebarConfigurator;
