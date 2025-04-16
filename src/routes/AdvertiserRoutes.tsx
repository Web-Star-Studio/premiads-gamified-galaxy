
import { Suspense, lazy, Fragment } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load advertiser pages
const AdvertiserDashboard = lazy(() => import("@/pages/AdvertiserDashboard"));
const AdvertiserProfile = lazy(() => import("@/pages/AdvertiserProfile"));
const AdvertiserCampaigns = lazy(() => import("@/pages/advertiser/AdvertiserCampaigns"));
const AdvertiserNewCampaign = lazy(() => import("@/pages/advertiser/NewCampaign"));
const AdvertiserAnalytics = lazy(() => import("@/pages/advertiser/AnalyticsPage"));
const AdvertiserCredits = lazy(() => import("@/pages/advertiser/CreditsPage"));
const AdvertiserNotifications = lazy(() => import("@/pages/advertiser/NotificationsPage"));
const AdvertiserSettings = lazy(() => import("@/pages/advertiser/SettingsPage"));
const AdvertiserProfilePage = lazy(() => import("@/pages/advertiser/ProfilePage"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

export const AdvertiserRoutes = () => {
  return (
    <Fragment>
      {/* Advertiser Routes */}
      <Route path="/anunciante" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserDashboard />
        </Suspense>
      } />
      <Route path="/anunciante/campanhas" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserCampaigns />
        </Suspense>
      } />
      <Route path="/anunciante/nova-campanha" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserNewCampaign />
        </Suspense>
      } />
      <Route path="/anunciante/analises" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserAnalytics />
        </Suspense>
      } />
      <Route path="/anunciante/creditos" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserCredits />
        </Suspense>
      } />
      <Route path="/anunciante/notificacoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserNotifications />
        </Suspense>
      } />
      <Route path="/anunciante/perfil" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserProfilePage />
        </Suspense>
      } />
      <Route path="/anunciante/configuracoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserSettings />
        </Suspense>
      } />
    </Fragment>
  );
};

export default AdvertiserRoutes;
