import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
import { RoutePreloader } from '@/components/progressive/RoutePreloader';
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

// Comprehensive route imports for preloading
const routeImports = {
  // Auth routes
  '/auth': () => import('@/pages/Authentication'),
  
  // Client routes
  '/cliente': () => import('@/pages/ClientDashboard'),
  '/cliente/missoes': () => import('@/pages/ClientMissions'),
  '/cliente/cashback': () => import('@/pages/CashbackMarketplace'),
  '/cliente/rifas': () => import('@/pages/ClientRaffles'),
  '/cliente/perfil': () => import('@/pages/ClientProfile'),
  '/cliente/recompensas': () => import('@/pages/client/RewardsPage'),
  '/cliente/notificacoes': () => import('@/pages/client/ClientNotifications'),
  '/cliente/indicacoes': () => import('@/pages/ClientReferrals'),
  
  // Advertiser routes
  '/anunciante': () => import('@/pages/AdvertiserDashboard'),
  '/anunciante/campanhas': () => import('@/pages/advertiser/AdvertiserCampaigns'),
  '/anunciante/nova-campanha': () => import('@/pages/advertiser/NewCampaign'),
  '/anunciante/moderacao': () => import('@/pages/advertiser/ModerationPage'),
  '/anunciante/analises': () => import('@/pages/advertiser/AnalyticsPage'),
  '/anunciante/creditos': () => import('@/pages/advertiser/CreditsPage'),
  '/anunciante/cashbacks': () => import('@/pages/anunciante/cashbacks'),
  '/anunciante/perfil': () => import('@/pages/advertiser/ProfilePage'),
  
  // Admin routes
  '/admin': () => import('@/pages/AdminPanel'),
  '/admin/usuarios': () => import('@/pages/admin/UserManagementPage'),
  '/admin/sorteios': () => import('@/pages/admin/LotteryManagementPage'),
  '/admin/moderacao': () => import('@/pages/admin/ModerationPage'),
  '/admin/documentacao': () => import('@/pages/admin/DocumentationPage'),
  '/admin/regras': () => import('@/pages/admin/RulesPage'),
  
  // Public routes (most accessed)
  '/': () => import('@/pages/Index'),
  '/sobre': () => import('@/pages/About'),
  '/como-funciona': () => import('@/pages/HowItWorks'),
  '/faq': () => import('@/pages/Faq'),
  '/blog': () => import('@/pages/Blog'),
};

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
                  <RoutePreloader routes={routeImports} />
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
