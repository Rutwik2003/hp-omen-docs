/**
 * Unified Layout System
 * 
 * Provides composable layout components for consistent page structure.
 * 
 * Usage:
 * ```tsx
 * import { BaseLayout, MainContent, PageHeader } from '@/features/layouts';
 * 
 * <BaseLayout>
 *   <PageHeader title="My Page" />
 *   <MainContent>
 *     {children}
 *   </MainContent>
 * </BaseLayout>
 * ```
 */

export { BaseLayout } from './BaseLayout';
export { MainContent } from './MainContent';
export { PageHeader } from './PageHeader';
export { ContentContainer } from './ContentContainer';

// Layout configuration types
export type { LayoutConfig, PageHeaderProps, MainContentProps } from './types';
