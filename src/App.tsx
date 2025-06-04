
import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import './index.css';

const App = () => (
  <OptimizedProviders>
    <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
      <AppRoutes />
    </Suspense>
  </OptimizedProviders>
);

export default App;
