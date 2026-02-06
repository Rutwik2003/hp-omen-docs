import React from 'react';
import type { MainContentProps } from './types';

const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1400px]',
    full: 'max-w-full',
};

const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8',
};

/**
 * Main content area with configurable width and padding
 */
export const MainContent: React.FC<MainContentProps> = ({
    children,
    maxWidth = 'xl',
    padding = 'md',
    centered = true,
}) => {
    return (
        <main
            className={`
                ${maxWidthClasses[maxWidth]}
                ${paddingClasses[padding]}
                ${centered ? 'mx-auto' : ''}
                w-full
            `.trim()}
        >
            {children}
        </main>
    );
};
