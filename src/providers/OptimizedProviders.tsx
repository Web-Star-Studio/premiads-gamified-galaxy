
import React, { memo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/query-client';

// Memoized provider to prevent unnecessary re-renders
const OptimizedProviders = memo(({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
));

OptimizedProviders.displayName = 'OptimizedProviders';

export { OptimizedProviders };
