
import { Suspense, lazy, Fragment } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load client pages
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const ClientProfile = lazy(() => import("@/pages/ClientProfile"));
const ClientMissions = lazy(() => import("@/pages/ClientMissions"));
const ClientReferrals = lazy(() => import("@/pages/ClientReferrals"));
const ClientRaffles = lazy(() => import("@/pages/ClientRaffles"));
const CashbackMarketplace = lazy(() => import("@/pages/CashbackMarketplace"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

export const ClientRoutes = () => {
  return (
    <Fragment>
      {/* Client Routes */}
      <Route path="/cliente" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientDashboard />
        </Suspense>
      } />
      <Route path="/cliente/missoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientMissions />
        </Suspense>
      } />
      <Route path="/cliente/indicacoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientReferrals />
        </Suspense>
      } />
      <Route path="/cliente/sorteios" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientRaffles />
        </Suspense>
      } />
      <Route path="/cliente/perfil" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientProfile />
        </Suspense>
      } />
      
      {/* Cashback Route */}
      <Route path="/cashback" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <CashbackMarketplace />
        </Suspense>
      } />
    </Fragment>
  );
};

export default ClientRoutes;
