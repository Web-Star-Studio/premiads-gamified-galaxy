
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientDashboard />
        </Suspense>
      } />
      <Route path="/missoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientMissions />
        </Suspense>
      } />
      <Route path="/indicacoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientReferrals />
        </Suspense>
      } />
      <Route path="/sorteios" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientRaffles />
        </Suspense>
      } />
      <Route path="/perfil" element={
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
    </Routes>
  );
};

export default ClientRoutes;
