import React from 'react';
import type { ContentContainerProps } from './types';

/**
 * Content container with optional card styling
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
    children,
    card = false,
    className = '',
}) => {
    if (card) {
        return (
            <div
                className={`
                    bg-gray-900/50 
                    border border-gray-800 
                    rounded-xl 
                    p-6
                    backdrop-blur-sm
                    ${className}
                `.trim()}
            >
                {children}
            </div>
        );
    }

    return (
        <div className={className}>
            {children}
        </div>
    );
};
