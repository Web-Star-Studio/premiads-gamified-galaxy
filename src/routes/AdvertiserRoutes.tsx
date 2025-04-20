import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/auth/RouteGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";

// Lazy load advertiser pages
const AdvertiserDashboard = lazy(() => import("@/pages/AdvertiserDashboard"));
const AdvertiserCampaigns = lazy(() => import("@/pages/advertiser/AdvertiserCampaigns"));
const AdvertiserNewCampaign = lazy(() => import("@/pages/advertiser/NewCampaign"));
const AdvertiserAnalytics = lazy(() => import("@/pages/advertiser/AnalyticsPage"));
const AdvertiserCredits = lazy(() => import("@/pages/advertiser/CreditsPage"));
const AdvertiserNotifications = lazy(() => import("@/pages/advertiser/NotificationsPage"));
const AdvertiserSettings = lazy(() => import("@/pages/advertiser/SettingsPage"));
const AdvertiserProfilePage = lazy(() => import("@/pages/advertiser/ProfilePage"));
const ModerationPage = lazy(() => import("@/pages/advertiser/ModerationPage"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const AdvertiserRoutes = () => {
  return (
    <RouteGuard userType="anunciante">
      <Routes>
        <Route index element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserDashboard />
          </Suspense>
        } />
        <Route path="campanhas" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserCampaigns />
          </Suspense>
        } />
        <Route path="nova-campanha" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserNewCampaign />
          </Suspense>
        } />
        <Route path="analises" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserAnalytics />
          </Suspense>
        } />
        <Route path="creditos" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserCredits />
          </Suspense>
        } />
        <Route path="notificacoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserNotifications />
          </Suspense>
        } />
        <Route path="perfil" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserProfilePage />
          </Suspense>
        } />
        <Route path="configuracoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserSettings />
          </Suspense>
        } />
        <Route path="moderacao" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ModerationPage />
          </Suspense>
        } />
        
        {/* Catch-all route for 404 handling within advertiser routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteGuard>
  );
};

export default AdvertiserRoutes;
