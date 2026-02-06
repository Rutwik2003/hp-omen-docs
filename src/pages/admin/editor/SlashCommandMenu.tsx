import React, { useEffect, useState } from 'react';
import { Type, Code, Info, LayoutGrid, Table, Image as ImageIcon } from 'lucide-react';
import { BlockType } from '../../../types/blocks';

interface SlashCommandMenuProps {
  position: { top: number; left: number } | null;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const ITEMS = [
  { label: 'Text', type: 'text', icon: Type },
  { label: 'Heading', type: 'heading', icon: Type }, // We handle heading as text variant usually, but specific block type here
  { label: 'Code', type: 'code', icon: Code },
  { label: 'Callout', type: 'callout', icon: Info },
  { label: 'Grid', type: 'grid', icon: LayoutGrid },
  { label: 'Table', type: 'table', icon: Table },
  { label: 'Image', type: 'image', icon: ImageIcon },
];

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ position, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + ITEMS.length) % ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(ITEMS[selectedIndex].type);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  if (!position) return null;

  return (
    <div 
      className="fixed z-50 w-60 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.top, left: position.left }}
    >
        <div className="p-1">
            <div className="text-xs font-medium text-neutral-500 px-2 py-1 mb-1">ADD BLOCK</div>
            {ITEMS.map((item, index) => (
                <button
                    key={item.type}
                    onClick={() => onSelect(item.type)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
                        index === selectedIndex ? 'bg-orange-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                </button>
            ))}
        </div>
    </div>
  );
};

export default SlashCommandMenu;
