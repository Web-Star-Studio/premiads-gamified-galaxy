
import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import { Toaster } from '@/components/ui/toaster';
import { RLSPerformanceStatus } from '@/components/performance/RLSPerformanceStatus';
import { PerformanceDebugger } from '@/components/performance/PerformanceDebugger';
import './index.css';

const App = () => (
  <OptimizedProviders>
    <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
      <AppRoutes />
    </Suspense>
    <Toaster />
    <RLSPerformanceStatus />
    <PerformanceDebugger />
  </OptimizedProviders>
);

export default App;
