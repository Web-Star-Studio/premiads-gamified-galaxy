import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import { PerformanceDebugger } from '@/components/performance/PerformanceDebugger';
import MissionErrorBoundary from '@/components/MissionErrorBoundary';
import './index.css';

const App = () => (
  <OptimizedProviders>
    <MissionErrorBoundary>
      <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
        <AppRoutes />
      </Suspense>
      <PerformanceDebugger />
    </MissionErrorBoundary>
  </OptimizedProviders>
);

export default App;
