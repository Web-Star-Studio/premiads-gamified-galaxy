import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import { Toaster } from '@/components/ui/toaster';
import './index.css';

const App = () => (
  <OptimizedProviders>
    <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
      <AppRoutes />
    </Suspense>
    <Toaster />
  </OptimizedProviders>
);

export default App;
