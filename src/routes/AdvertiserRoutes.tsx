
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/auth/RouteGuard";

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
    <Routes>
      <Route index element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserDashboard />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="campanhas" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserCampaigns />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="nova-campanha" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserNewCampaign />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="analises" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserAnalytics />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="creditos" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserCredits />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="notificacoes" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserNotifications />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="perfil" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserProfilePage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="configuracoes" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdvertiserSettings />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="moderacao" element={
        <RouteGuard allowedRoles={["anunciante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ModerationPage />
          </Suspense>
        </RouteGuard>
      } />
      
      {/* Catch-all route for 404 handling within advertiser routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdvertiserRoutes;
