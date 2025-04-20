
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/auth/RouteGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";

// Lazy load client pages
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const ClientMissions = lazy(() => import("@/pages/ClientMissions"));
const ClientProfile = lazy(() => import("@/pages/ClientProfile"));
const ClientRaffles = lazy(() => import("@/pages/ClientRaffles"));
const ClientReferrals = lazy(() => import("@/pages/ClientReferrals"));
const CashbackMarketplace = lazy(() => import("@/pages/CashbackMarketplace"));
const Support = lazy(() => import("@/pages/Support"));
const Tour = lazy(() => import("@/pages/Tour"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Faq = lazy(() => import("@/pages/Faq"));
const ClientNotifications = lazy(() => import("@/pages/client/ClientNotifications"));

const ClientRoutes = () => {
  return (
    <RouteGuard userType="participante">
      <Routes>
        <Route index element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientDashboard />
          </Suspense>
        } />
        <Route path="missoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientMissions />
          </Suspense>
        } />
        <Route path="perfil" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientProfile />
          </Suspense>
        } />
        <Route path="sorteios" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientRaffles />
          </Suspense>
        } />
        <Route path="indicacoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientReferrals />
          </Suspense>
        } />
        <Route path="cashback" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <CashbackMarketplace />
          </Suspense>
        } />
        <Route path="suporte" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Support />
          </Suspense>
        } />
        <Route path="tour" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Tour />
          </Suspense>
        } />
        <Route path="como-funciona" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <HowItWorks />
          </Suspense>
        } />
        <Route path="faq" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Faq />
          </Suspense>
        } />
        <Route path="notificacoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientNotifications />
          </Suspense>
        } />
        
        {/* Catch-all route for 404 handling within client routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteGuard>
  );
};

export default ClientRoutes;
