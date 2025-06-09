
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingScreen } from '@/components/LoadingScreen';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  name?: string;
}

export const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({
  children,
  fallback,
  errorFallback,
  name = 'Component'
}) => {
  const defaultFallback = fallback || <LoadingScreen variant="minimal" message={`Carregando ${name}...`} />;
  const defaultErrorFallback = errorFallback || (
    <div className="p-4 text-center text-destructive">
      Erro ao carregar {name}
    </div>
  );

  return (
    <ErrorBoundary fallback={defaultErrorFallback}>
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Specialized boundaries for different sections
export const DashboardSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuspenseBoundary
    name="Dashboard"
    fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}
  >
    {children}
  </SuspenseBoundary>
);

export const MissionsSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuspenseBoundary
    name="Missões"
    fallback={<div className="animate-pulse bg-muted h-48 rounded-lg" />}
  >
    {children}
  </SuspenseBoundary>
);

export const CashbackSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuspenseBoundary
    name="Cashback"
    fallback={<div className="animate-pulse bg-muted h-56 rounded-lg" />}
  >
    {children}
  </SuspenseBoundary>
);

export const ChartsSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuspenseBoundary
    name="Gráficos"
    fallback={<div className="animate-pulse bg-muted h-80 rounded-lg" />}
  >
    {children}
  </SuspenseBoundary>
);
