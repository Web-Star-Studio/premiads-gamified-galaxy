
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadRoute } from '@/utils/performance';

interface RoutePreloaderProps {
  routes: Record<string, () => Promise<any>>;
  preloadDelay?: number;
}

export const RoutePreloader: React.FC<RoutePreloaderProps> = ({
  routes,
  preloadDelay = 2000
}) => {
  const location = useLocation();

  const preloadRoutes = useCallback(() => {
    // Preload likely next routes based on current location
    const currentPath = location.pathname;
    
    if (currentPath === '/') {
      // From homepage, preload auth routes
      preloadRoute(routes['/auth']);
    } else if (currentPath === '/auth') {
      // From auth, preload dashboard routes
      preloadRoute(routes['/cliente']);
      preloadRoute(routes['/anunciante']);
    } else if (currentPath.startsWith('/cliente')) {
      // From client dashboard, preload related pages
      preloadRoute(routes['/cliente/missoes']);
      preloadRoute(routes['/cliente/cashback']);
      preloadRoute(routes['/cliente/rifas']);
    } else if (currentPath.startsWith('/anunciante')) {
      // From advertiser dashboard, preload related pages
      preloadRoute(routes['/anunciante/campanhas']);
      preloadRoute(routes['/anunciante/moderacao']);
    }
  }, [location.pathname, routes]);

  useEffect(() => {
    const timer = setTimeout(preloadRoutes, preloadDelay);
    return () => clearTimeout(timer);
  }, [preloadRoutes, preloadDelay]);

  return null;
};

// Hook for intelligent route preloading
export const useRoutePreloading = () => {
  const preloadClientRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/ClientDashboard'),
      import('@/pages/ClientMissions'),
      import('@/pages/CashbackMarketplace'),
      import('@/pages/ClientRaffles')
    ]);
  }, []);

  const preloadAdvertiserRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/AdvertiserDashboard'),
      import('@/pages/advertiser/AdvertiserCampaigns'),
      import('@/pages/advertiser/ModerationPage')
    ]);
  }, []);

  const preloadAdminRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/AdminPanel'),
      import('@/pages/admin/UserManagementPage'),
      import('@/pages/admin/LotteryManagementPage')
    ]);
  }, []);

  return {
    preloadClientRoutes,
    preloadAdvertiserRoutes,
    preloadAdminRoutes
  };
};
