import React from 'react';
import type { BaseLayoutProps } from './types';

/**
 * Base layout wrapper that provides consistent styling and structure
 * for all pages in the application.
 */
export const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    config = {},
    className = '',
}) => {
    const {
        background = 'default',
        fullWidth = false,
    } = config;

    const backgroundClasses = {
        default: 'bg-[#0a0a0a]',
        gradient: 'bg-gradient-to-b from-[#0a0a0a] to-gray-900',
        plain: 'bg-black',
    };

    return (
        <div
            className={`
                min-h-screen 
                ${backgroundClasses[background]} 
                text-white 
                font-sans 
                selection:bg-orange-500/30
                ${fullWidth ? '' : 'overflow-x-hidden'}
                ${className}
            `.trim()}
        >
            {children}
        </div>
    );
};
