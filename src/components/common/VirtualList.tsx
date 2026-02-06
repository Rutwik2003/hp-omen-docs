import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Props for VirtualList component
 */
interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels (can be number or function for variable heights) */
  estimateSize: number | ((index: number) => number);
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Container className */
  className?: string;
  /** Maximum height before scrolling kicks in */
  maxHeight?: number;
  /** Number of items to render outside visible area (improves scroll smoothness) */
  overscan?: number;
  /** Unique key extractor for items */
  getItemKey?: (index: number) => string | number;
  /** Gap between items in pixels */
  gap?: number;
  /** Empty state component when items array is empty */
  emptyState?: React.ReactNode;
}

/**
 * A virtualized list component for efficiently rendering large lists.
 * Only renders items that are visible in the viewport + overscan buffer.
 * 
 * @example
 * // Fixed height items
 * <VirtualList
 *   items={drafts}
 *   estimateSize={80}
 *   maxHeight={400}
 *   renderItem={(draft, index) => <DraftCard draft={draft} />}
 * />
 * 
 * @example
 * // Variable height items
 * <VirtualList
 *   items={searchResults}
 *   estimateSize={(index) => items[index].hasPreview ? 120 : 60}
 *   renderItem={(result) => <SearchResult result={result} />}
 * />
 */
export function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  className = '',
  maxHeight = 400,
  overscan = 5,
  getItemKey,
  gap = 0,
  emptyState,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: typeof estimateSize === 'function' ? estimateSize : () => estimateSize,
    overscan,
    getItemKey,
    gap,
  });

  // Don't virtualize if list is small enough
  const shouldVirtualize = items.length > 20;

  if (items.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  // For small lists, render normally without virtualization overhead
  if (!shouldVirtualize) {
    return (
      <div className={className} style={{ maxHeight, overflowY: 'auto' }}>
        <div className="flex flex-col" style={{ gap }}>
          {items.map((item, index) => (
            <div key={getItemKey ? getItemKey(index) : index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Virtualized rendering for large lists
  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ maxHeight }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook for creating a virtual list with more control.
 * Use this when you need access to the virtualizer instance directly.
 * 
 * @example
 * const { parentRef, virtualizer, virtualItems } = useVirtualList({
 *   items: myItems,
 *   estimateSize: 80,
 * });
 */
export function useVirtualList<T>({
  items,
  estimateSize,
  overscan = 5,
  getItemKey,
  gap = 0,
}: Pick<VirtualListProps<T>, 'items' | 'estimateSize' | 'overscan' | 'getItemKey' | 'gap'>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: typeof estimateSize === 'function' ? estimateSize : () => estimateSize,
    overscan,
    getItemKey,
    gap,
  });

  return {
    parentRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  };
}

export default VirtualList;
