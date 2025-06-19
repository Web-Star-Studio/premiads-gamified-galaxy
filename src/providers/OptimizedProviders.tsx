import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
// import { RoutePreloader } from '@/components/progressive/RoutePreloader';
import LoadingScreen from '@/components/LoadingScreen';
import { AuthProvider } from '@/hooks/useAuth';

// Create optimized query client with performance settings
const createOptimizedQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

const queryClient = createOptimizedQueryClient();

// Route imports for preloading
/*
const routeImports = {
  '/auth': () => import('@/pages/Authentication'),
  '/cliente': () => import('@/pages/ClientDashboard'),
  '/cliente/missoes': () => import('@/pages/ClientMissions'),
  '/cliente/cashback': () => import('@/pages/CashbackMarketplace'),
  '/cliente/rifas': () => import('@/pages/ClientRaffles'),
  '/anunciante': () => import('@/pages/AdvertiserDashboard'),
  '/anunciante/campanhas': () => import('@/pages/advertiser/AdvertiserCampaigns'),
  '/anunciante/moderacao': () => import('@/pages/advertiser/ModerationPage'),
  '/admin': () => import('@/pages/AdminPanel'),
};
*/

interface OptimizedProvidersProps {
  children: React.ReactNode;
}

export const OptimizedProviders: React.FC<OptimizedProvidersProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingScreen message="Inicializando aplicação..." />}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PerformanceProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <HelmetProvider>
                <AuthProvider>
                  {/* <RoutePreloader routes={routeImports} /> */}
                  {children}
                  <Toaster 
                    position="top-right"
                    richColors
                    closeButton
                    expand={false}
                    duration={4000}
                  />
                </AuthProvider>
              </HelmetProvider>
            </ThemeProvider>
          </PerformanceProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </Suspense>
  );
};
