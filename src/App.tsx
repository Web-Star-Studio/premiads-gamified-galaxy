import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import { Toaster } from '@/components/ui/toaster';
import { QueryErrorBoundary } from '@/components/core/QueryErrorBoundary';
import { useQueryDebugger } from '@/hooks/core/useQueryDebugger';
import './index.css';

const AppContent = () => {
  // Debug temporário para entender o problema
  useQueryDebugger(true);
  
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </QueryErrorBoundary>
  );
};

const App = () => (
  <OptimizedProviders>
    <AppContent />
  </OptimizedProviders>
);

export default App;
