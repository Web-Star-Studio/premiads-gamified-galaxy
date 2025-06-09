
import React, { Suspense, lazy, memo, useMemo, useCallback } from 'react';

export const lazyImport = <T extends object>(
  importFunc: () => Promise<T>,
  namedExport?: keyof T
) => {
  return lazy(() => {
    const promise = importFunc();
    if (namedExport == null) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });
};

export const optimizeComponent = <T extends object>(
  Component: React.ComponentType<T>,
  displayName?: string
) => {
  const MemoizedComponent = memo(Component);
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }
  return MemoizedComponent;
};

export const withSuspense = <T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType
) => {
  const FallbackComponent = fallback || (() => <div>Loading...</div>);
  
  return (props: T) => (
    <Suspense fallback={<FallbackComponent />}>
      <Component {...props} />
    </Suspense>
  );
};

export { useMemo, useCallback, memo };
