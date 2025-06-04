import React, { memo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/hooks/useAuth';
import { CreditsProvider } from './credits-provider';
import { UserProvider } from '@/context/UserContext';

// Memoized provider to prevent unnecessary re-renders
const OptimizedProviders = memo(({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CreditsProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </CreditsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
));

OptimizedProviders.displayName = 'OptimizedProviders';

export { OptimizedProviders };
