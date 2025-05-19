
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/auth/RouteGuard";

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
const RewardsPage = lazy(() => import("@/pages/client/RewardsPage"));

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientDashboard />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="missoes" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientMissions />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="perfil" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientProfile />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="sorteios" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientRaffles />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="indicacoes" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientReferrals />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="cashback" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <CashbackMarketplace />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="suporte" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <Support />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="tour" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <Tour />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="como-funciona" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <HowItWorks />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="faq" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <Faq />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="notificacoes" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientNotifications />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="recompensas" element={
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <RewardsPage />
          </Suspense>
        </RouteGuard>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoutes;
