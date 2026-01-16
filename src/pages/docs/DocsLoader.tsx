import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import TemplatePage from './TemplatePage';
import { DocPage } from '../../types/docs';

// Eagerly load all content JSONs to create a map
// In Vite, import.meta.glob returns a map of paths to modules
const contentModules = import.meta.glob('../../content/**/*.json', { eager: true });

interface DocsLoaderProps {
    slug?: string; // Optional slug override
    category?: string; // Optional category override
}

const DocsLoader: React.FC<DocsLoaderProps> = ({ slug: propSlug, category: propCategory }) => {
    // We expect the route to be /docs/:category/:slug or just /docs/:slug (depending on structure)
    // For now assuming App.tsx passes the last segment as 'slug' or we capture path
    const params = useParams();
    const slug = propSlug || params.slug;
    const category = propCategory || params.category;

    // Map content files to slugs
    // File structure: ../../content/[category]/[slug].json
    const pageData = useMemo(() => {
        const matchingPath = Object.keys(contentModules).find(path => {
             // path examples: ../../content/quickstart/setup.json
             const parts = path.split('/');
             const filename = parts.pop()?.replace('.json', '');
             const fileCategory = parts.pop(); // quickstart

             if (category && fileCategory !== category) return false;
             return filename === slug;
        });

        if (matchingPath) {
             return (contentModules[matchingPath] as { default: DocPage }).default;
        }
        return null;
    }, [slug, category]);

    if (!pageData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                 <h2 className="text-2xl font-bold text-red-500 mb-2">404 - Guide Not Found</h2>
                 <p className="text-gray-400">The requested documentation page <code>{slug}</code> does not exist in the CMS.</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{pageData.title} | HP OMEN Guide</title>
                <meta name="description" content={pageData.description} />
                <meta property="og:title" content={pageData.title} />
                <meta property="og:description" content={pageData.description} />
                {pageData.metadata.tags && (
                    <meta name="keywords" content={pageData.metadata.tags.join(', ')} />
                )}
            </Helmet>
            <TemplatePage data={pageData} />
        </>
    );
};

export default DocsLoader;
