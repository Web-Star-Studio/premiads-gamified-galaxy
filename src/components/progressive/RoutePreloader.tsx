
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
      // From homepage, preload auth routes and common pages
      preloadRoute(routes['/auth']);
      preloadRoute(routes['/sobre']);
      preloadRoute(routes['/como-funciona']);
    } else if (currentPath === '/auth') {
      // From auth, preload all dashboard routes
      preloadRoute(routes['/cliente']);
      preloadRoute(routes['/anunciante']);
      preloadRoute(routes['/admin']);
    } else if (currentPath === '/cliente' || currentPath === '/cliente/') {
      // From client dashboard, preload most accessed client pages
      preloadRoute(routes['/cliente/missoes']);
      preloadRoute(routes['/cliente/cashback']);
      preloadRoute(routes['/cliente/rifas']);
      preloadRoute(routes['/cliente/recompensas']);
      preloadRoute(routes['/cliente/perfil']);
    } else if (currentPath.startsWith('/cliente/missoes')) {
      // From missions, preload rewards and cashback
      preloadRoute(routes['/cliente/recompensas']);
      preloadRoute(routes['/cliente/cashback']);
    } else if (currentPath === '/anunciante' || currentPath === '/anunciante/') {
      // From advertiser dashboard, preload core advertiser pages
      preloadRoute(routes['/anunciante/campanhas']);
      preloadRoute(routes['/anunciante/nova-campanha']);
      preloadRoute(routes['/anunciante/moderacao']);
      preloadRoute(routes['/anunciante/analises']);
      preloadRoute(routes['/anunciante/creditos']);
    } else if (currentPath.startsWith('/anunciante/campanhas')) {
      // From campaigns, preload creation and moderation
      preloadRoute(routes['/anunciante/nova-campanha']);
      preloadRoute(routes['/anunciante/moderacao']);
    } else if (currentPath === '/admin' || currentPath === '/admin/') {
      // From admin dashboard, preload core admin pages
      preloadRoute(routes['/admin/usuarios']);
      preloadRoute(routes['/admin/sorteios']);
      preloadRoute(routes['/admin/moderacao']);
      preloadRoute(routes['/admin/regras']);
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
      import('@/pages/ClientRaffles'),
      import('@/pages/ClientProfile'),
      import('@/pages/client/RewardsPage'),
      import('@/pages/client/ClientNotifications'),
      import('@/pages/ClientReferrals')
    ]);
  }, []);

  const preloadAdvertiserRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/AdvertiserDashboard'),
      import('@/pages/advertiser/AdvertiserCampaigns'),
      import('@/pages/advertiser/NewCampaign'),
      import('@/pages/advertiser/ModerationPage'),
      import('@/pages/advertiser/AnalyticsPage'),
      import('@/pages/advertiser/CreditsPage'),
      import('@/pages/anunciante/cashbacks'),
      import('@/pages/advertiser/ProfilePage')
    ]);
  }, []);

  const preloadAdminRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/AdminPanel'),
      import('@/pages/admin/UserManagementPage'),
      import('@/pages/admin/LotteryManagementPage'),
      import('@/pages/admin/ModerationPage'),
      import('@/pages/admin/DocumentationPage'),
      import('@/pages/admin/RulesPage'),
      import('@/pages/admin/RifasManagementPage'),
      import('@/pages/admin/AdminProfilePage')
    ]);
  }, []);

  const preloadPublicRoutes = useCallback(() => {
    Promise.all([
      import('@/pages/Index'),
      import('@/pages/About'),
      import('@/pages/HowItWorks'),
      import('@/pages/Faq'),
      import('@/pages/Blog'),
      import('@/pages/Authentication')
    ]);
  }, []);

  return {
    preloadClientRoutes,
    preloadAdvertiserRoutes,
    preloadAdminRoutes,
    preloadPublicRoutes
  };
};
