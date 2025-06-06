import React, { Suspense } from 'react';
import { OptimizedProviders } from './providers/OptimizedProviders';
import AppRoutes from './routes/AppRoutes';
import { Loading } from './components/atoms';
import { Toaster } from 'react-hot-toast';
import './index.css';

const App = () => (
  <OptimizedProviders>
    <Suspense fallback={<Loading size="lg" text="Carregando aplicação..." />}>
      <AppRoutes />
    </Suspense>
    <Toaster 
      position="top-right"
      toastOptions={{
        className: 'bg-card text-foreground border border-border',
        duration: 5000,
        success: {
          className: 'bg-green-900/50 text-white border-green-500/50',
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          className: 'bg-red-900/50 text-white border-red-500/50',
          iconTheme: {
            primary: '#F87171',
            secondary: 'white',
          },
        },
      }}
    />
  </OptimizedProviders>
);

export default App;
