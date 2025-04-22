
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
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

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientDashboard />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="missoes" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientMissions />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="perfil" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientProfile />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="sorteios" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientRaffles />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="indicacoes" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientReferrals />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="cashback" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <CashbackMarketplace />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="suporte" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Support />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="tour" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Tour />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="como-funciona" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <HowItWorks />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="faq" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Faq />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="notificacoes" element={
        <RouteGuard allowedRoles={["participante"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ClientNotifications />
          </Suspense>
        </RouteGuard>
      } />
      
      {/* Catch-all route for 404 handling within client routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoutes;
