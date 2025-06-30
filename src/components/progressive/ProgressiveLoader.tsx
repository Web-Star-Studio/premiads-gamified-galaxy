
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingScreen from '@/components/LoadingScreen';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({ 
  children, 
  fallback = <LoadingScreen />
}) => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProgressiveLoader;
