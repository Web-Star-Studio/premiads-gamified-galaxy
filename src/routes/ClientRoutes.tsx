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
    <Routes>
      <Route index element={<Suspense fallback={<LoadingSpinner />}><ClientDashboard /></Suspense>} />
      <Route path="missoes" element={<Suspense fallback={<LoadingSpinner />}><ClientMissions /></Suspense>} />
      <Route path="perfil" element={<Suspense fallback={<LoadingSpinner />}><ClientProfile /></Suspense>} />
      <Route path="sorteios" element={<Suspense fallback={<LoadingSpinner />}><ClientRaffles /></Suspense>} />
      <Route path="indicacoes" element={<Suspense fallback={<LoadingSpinner />}><ClientReferrals /></Suspense>} />
      <Route path="cashback" element={<Suspense fallback={<LoadingSpinner />}><CashbackMarketplace /></Suspense>} />
      <Route path="suporte" element={<Suspense fallback={<LoadingSpinner />}><Support /></Suspense>} />
      <Route path="tour" element={<Suspense fallback={<LoadingSpinner />}><Tour /></Suspense>} />
      <Route path="como-funciona" element={<Suspense fallback={<LoadingSpinner />}><HowItWorks /></Suspense>} />
      <Route path="faq" element={<Suspense fallback={<LoadingSpinner />}><Faq /></Suspense>} />
      <Route path="notificacoes" element={<Suspense fallback={<LoadingSpinner />}><ClientNotifications /></Suspense>} />
      <Route path="recompensas" element={<Suspense fallback={<LoadingSpinner />}><RewardsPage /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>} />
    </Routes>
  </RouteGuard>
);

export default ClientRoutes;
