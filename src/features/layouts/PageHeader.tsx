import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { PageHeaderProps } from './types';

/**
 * Consistent page header with title, description, and optional breadcrumbs
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    breadcrumbs,
    actions,
    centered = false,
}) => {
    return (
        <header className={`mb-8 ${centered ? 'text-center' : ''}`}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            )}
                            {crumb.path ? (
                                <Link
                                    to={crumb.path}
                                    className="hover:text-orange-400 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-300">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {/* Title and Actions row */}
            <div className={`flex items-start gap-4 ${centered ? 'justify-center' : 'justify-between'}`}>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white omen-text-glow">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-lg text-gray-400 max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
};
