import React from 'react';

export interface LayoutConfig {
    /** Whether to show the sidebar */
    showSidebar?: boolean;
    /** Sidebar variant */
    sidebarVariant?: 'docs' | 'admin' | 'minimal';
    /** Whether to use full width */
    fullWidth?: boolean;
    /** Background variant */
    background?: 'default' | 'gradient' | 'plain';
}

export interface PageHeaderProps {
    /** Page title */
    title: string;
    /** Optional subtitle/description */
    description?: string;
    /** Breadcrumb items */
    breadcrumbs?: Array<{ label: string; path?: string }>;
    /** Actions to display in header */
    actions?: React.ReactNode;
    /** Whether to center the content */
    centered?: boolean;
}

export interface MainContentProps {
    /** Content children */
    children: React.ReactNode;
    /** Maximum width constraint */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    /** Padding configuration */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Whether to center content horizontally */
    centered?: boolean;
}

export interface ContentContainerProps {
    /** Content children */
    children: React.ReactNode;
    /** Card-like appearance */
    card?: boolean;
    /** Additional className */
    className?: string;
}

export interface BaseLayoutProps {
    /** Layout children */
    children: React.ReactNode;
    /** Layout configuration */
    config?: LayoutConfig;
    /** Additional className for the container */
    className?: string;
}
