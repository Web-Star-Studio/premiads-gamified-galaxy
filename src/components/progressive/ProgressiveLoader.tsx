
import React, { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  useIntersection?: boolean;
}

const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({ 
  children, 
  fallback = <LoadingScreen />,
  delay,
  useIntersection
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const SectionLoader: React.FC<ProgressiveLoaderProps> = (props) => {
  return <ProgressiveLoader {...props} />;
};

export default ProgressiveLoader;
