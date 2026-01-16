
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DocsSidebar, NavItem } from '../components/ui/DocsSidebar';

// Example Navigation Data - Should be moved to a separate data file eventually
const DOCS_NAV: NavItem[] = [
  { title: "Introduction", href: "/docs" },
  { 
    title: "Getting Started", 
    defaultOpen: true,
    items: [
        { title: "Installation", href: "/docs/installation" },
        { title: "First Steps", href: "/docs/first-steps" }
    ]
  },
  {
      title: "Troubleshooting",
      items: [
          { title: "Common Issues", href: "/docs/common-issues" },
          { title: "Battery Drain", href: "/docs/battery-drain" }
      ]
  }
];

export const DocsLayout = () => {
  return (
    <div className="flex h-screen pt-20 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 pt-24 pl-6 z-20">
            <DocsSidebar navItems={DOCS_NAV} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:pl-72 flex">
            <div className="flex-1 min-w-0 py-8 px-6 lg:px-8">
                 <Outlet />
            </div>
            
            {/* Right TOC (Placeholder) */}
            <aside className="hidden xl:block w-64 pr-6 py-8">
                <div className="sticky top-24">
                    <h5 className="text-sm font-semibold text-neutral-200 mb-4">On This Page</h5>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        {/* Logic to generate TOC based on content headers would go here */}
                         <li><a href="#" className="hover:text-neon-orange transition-colors">Overview</a></li>
                         <li><a href="#" className="hover:text-neon-orange transition-colors">Features</a></li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
  );
};
