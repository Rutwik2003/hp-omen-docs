import { 
  Home, 
  Zap, 
  Monitor, 
  Settings, 
  HelpCircle, 
  Download, 
  Wrench,
  MessageCircle,
  ExternalLink,
  Book,
  Cpu,
  Gamepad2,
  Shield,
  Thermometer,
  HardDrive,
  type LucideIcon
} from 'lucide-react';

// Available icons for sidebar items
export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  Home,
  Zap,
  Monitor,
  Settings,
  HelpCircle,
  Download,
  Wrench,
  MessageCircle,
  ExternalLink,
  Book,
  Cpu,
  Gamepad2,
  Shield,
  Thermometer,
  HardDrive,
};

export interface SidebarSubItem {
  id: string;
  name: string;
  href: string;
  visible: boolean;
}

export interface SidebarItem {
  id: string;
  name: string;
  href: string;
  icon: string; // Icon name from AVAILABLE_ICONS
  visible: boolean;
  order: number;
  items?: SidebarSubItem[]; // Sub-items (loaded dynamically from category)
  category?: string; // Category to load sub-items from
}

export interface SidebarConfig {
  version: number;
  lastUpdated: string;
  items: SidebarItem[];
  footerLinks: {
    discord: {
      visible: boolean;
      url: string;
      label: string;
    };
    branding: {
      title: string;
      subtitle: string;
      tagline: string;
    };
  };
}

// Default sidebar configuration
export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  items: [
    {
      id: 'home',
      name: 'Home',
      href: '/',
      icon: 'Home',
      visible: true,
      order: 0,
    },
    {
      id: 'quickstart',
      name: 'Quick Start',
      href: '/quickstart',
      icon: 'Zap',
      visible: true,
      order: 1,
      category: 'quickstart',
    },
    {
      id: 'windows',
      name: 'Windows Guides',
      href: '/windows',
      icon: 'Monitor',
      visible: true,
      order: 2,
      category: 'windows',
    },
    {
      id: 'linux',
      name: 'Linux Guides',
      href: '/linux',
      icon: 'Settings',
      visible: true,
      order: 3,
      category: 'linux',
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      href: '/troubleshooting',
      icon: 'HelpCircle',
      visible: true,
      order: 4,
      category: 'troubleshooting',
    },
    {
      id: 'performance',
      name: 'Performance',
      href: '/performance',
      icon: 'Zap',
      visible: true,
      order: 5,
      category: 'performance',
    },
    {
      id: 'drivers',
      name: 'Drivers & Software',
      href: '/drivers',
      icon: 'Download',
      visible: true,
      order: 6,
    },
    {
      id: 'hardware',
      name: 'Hardware Guides',
      href: '/hardware',
      icon: 'Wrench',
      visible: true,
      order: 7,
    },
    {
      id: 'contribute',
      name: 'Contribute',
      href: '/contribute',
      icon: 'ExternalLink',
      visible: true,
      order: 8,
    },
  ],
  footerLinks: {
    discord: {
      visible: true,
      url: 'https://discord.com/invite/omen-by-hp-750760232954888363',
      label: 'Discord',
    },
    branding: {
      title: 'OMEN Gaming',
      subtitle: 'Community Docs',
      tagline: 'Unofficial Fan Project',
    },
  },
};

// Local storage key for sidebar config
const SIDEBAR_CONFIG_KEY = 'omen_sidebar_config';

// Get sidebar configuration from localStorage or use default
export const getSidebarConfig = (): SidebarConfig => {
  try {
    const stored = localStorage.getItem(SIDEBAR_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SidebarConfig;
      // Merge with defaults to handle new fields
      return {
        ...DEFAULT_SIDEBAR_CONFIG,
        ...parsed,
        items: parsed.items || DEFAULT_SIDEBAR_CONFIG.items,
        footerLinks: {
          ...DEFAULT_SIDEBAR_CONFIG.footerLinks,
          ...parsed.footerLinks,
        },
      };
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[DEV] Error loading sidebar config:', error);
    }
  }
  return DEFAULT_SIDEBAR_CONFIG;
};

// Save sidebar configuration to localStorage
export const saveSidebarConfig = (config: SidebarConfig): void => {
  try {
    config.lastUpdated = new Date().toISOString();
    config.version = (config.version || 0) + 1;
    localStorage.setItem(SIDEBAR_CONFIG_KEY, JSON.stringify(config));
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('sidebarConfigUpdated', { detail: config }));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[DEV] Error saving sidebar config:', error);
    }
  }
};

// Reset sidebar configuration to defaults
export const resetSidebarConfig = (): SidebarConfig => {
  localStorage.removeItem(SIDEBAR_CONFIG_KEY);
  window.dispatchEvent(new CustomEvent('sidebarConfigUpdated', { detail: DEFAULT_SIDEBAR_CONFIG }));
  return DEFAULT_SIDEBAR_CONFIG;
};

// Export config as JSON file
export const exportSidebarConfig = (config: SidebarConfig): void => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sidebar-config-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import config from JSON file
export const importSidebarConfig = (file: File): Promise<SidebarConfig> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as SidebarConfig;
        saveSidebarConfig(config);
        resolve(config);
      } catch (error) {
        reject(new Error('Invalid configuration file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
