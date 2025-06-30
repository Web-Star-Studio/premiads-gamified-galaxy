
import React, { Suspense } from 'react';
import { useProgressiveLoading, useIntersectionObserver } from '@/utils/performance';
import { LoadingScreen } from '@/components/LoadingScreen';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
  useIntersection?: boolean;
  threshold?: number;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  delay = 100,
  fallback,
  useIntersection = false,
  threshold = 0.1
}) => {
  const isTimeVisible = useProgressiveLoading(delay);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin: '50px'
  });

  const shouldRender = useIntersection ? isIntersecting : isTimeVisible;
  const defaultFallback = fallback || <LoadingScreen variant="minimal" />;

  if (useIntersection) {
    return (
      <div ref={targetRef}>
        {shouldRender ? (
          <Suspense fallback={defaultFallback}>
            {children}
          </Suspense>
        ) : (
          defaultFallback
        )}
      </div>
    );
  }

  return shouldRender ? (
    <Suspense fallback={defaultFallback}>
      {children}
    </Suspense>
  ) : (
    defaultFallback
  );
};

// Specialized loaders for different content types
export const SectionLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProgressiveLoader
    delay={200}
    useIntersection
    fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}
  >
    {children}
  </ProgressiveLoader>
);

export const ChartLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProgressiveLoader
    delay={300}
    useIntersection
    fallback={<div className="animate-pulse bg-muted h-80 rounded-lg" />}
  >
    {children}
  </ProgressiveLoader>
);

export const TableLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProgressiveLoader
    delay={150}
    useIntersection
    fallback={
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-12 rounded" />
        ))}
      </div>
    }
  >
    {children}
  </ProgressiveLoader>
);
