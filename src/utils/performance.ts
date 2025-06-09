
import React, { useCallback, useRef, useMemo } from 'react';

// Performance utilities for optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttle hook for scroll/resize events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T => {
  const inThrottle = useRef<boolean>(false);

  return useCallback(
    ((...args: any[]) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [callback, limit]
  );
};

// Lazy import utility with proper Suspense wrapper
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// HOC for wrapping components with Suspense
export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode = <div>Loading...</div>
) => {
  return React.memo((props: P) => (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  ));
};

// Memoization helper for complex props
export const useMemoizedProps = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Preload route utility
export const preloadRoute = (routeImport: () => Promise<any>) => {
  const componentImport = routeImport();
  return componentImport;
};

// Performance timing utility
export const measurePerformance = <T>(
  name: string,
  fn: () => T
): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`⚡ ${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  return {
    ...visibleItems,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};
