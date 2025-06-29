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

const ClientRoutes = () => (
  <RouteGuard>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<ClientDashboard />} />
        <Route path="missoes" element={<ClientMissions />} />
        <Route path="perfil" element={<ClientProfile />} />
        <Route path="sorteios" element={<ClientRaffles />} />
        <Route path="indicacoes" element={<ClientReferrals />} />
        <Route path="cashback" element={<CashbackMarketplace />} />
        <Route path="suporte" element={<Support />} />
        <Route path="tour" element={<Tour />} />
        <Route path="como-funciona" element={<HowItWorks />} />
        <Route path="faq" element={<Faq />} />
        <Route path="notificacoes" element={<ClientNotifications />} />
        <Route path="recompensas" element={<RewardsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </RouteGuard>
);

export default ClientRoutes;
