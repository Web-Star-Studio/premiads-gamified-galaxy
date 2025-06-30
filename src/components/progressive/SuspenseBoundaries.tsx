
import React, { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({
  children,
  fallback = <LoadingScreen />,
  errorFallback = <div>Something went wrong</div>
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const MissionsSuspense: React.FC<SuspenseBoundaryProps> = (props) => {
  return <SuspenseBoundary {...props} />;
};

export default SuspenseBoundary;
