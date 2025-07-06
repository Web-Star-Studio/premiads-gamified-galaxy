import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/auth/RouteGuard";

// Lazy load advertiser pages
const AdvertiserDashboard = lazy(() => import("@/pages/AdvertiserDashboard"));
const AdvertiserCampaigns = lazy(() => import("@/pages/advertiser/AdvertiserCampaigns"));
const AdvertiserCashbacksPage = lazy(() => import("@/pages/anunciante/cashbacks"));
const AdvertiserNewCampaign = lazy(() => import("@/pages/advertiser/NewCampaign"));
const AdvertiserAnalytics = lazy(() => import("@/pages/advertiser/AnalyticsPage"));
const AdvertiserCredits = lazy(() => import("@/pages/advertiser/CreditsPage"));
const AdvertiserNotifications = lazy(() => import("@/pages/advertiser/NotificationsPage"));
const AdvertiserSettings = lazy(() => import("@/pages/advertiser/SettingsPage"));
const AdvertiserProfilePage = lazy(() => import("@/pages/advertiser/ProfilePage"));
const ModerationPage = lazy(() => import("@/pages/advertiser/ModerationPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/advertiser/PaymentSuccessPage"));
const PagamentoMockPage = lazy(() => import("@/pages/anunciante/pagamento-mock"));
const AdvertiserCrmPage = lazy(() => import("@/pages/advertiser/CrmPage"));
const CouponValidationPage = lazy(() => import("@/pages/advertiser/CouponValidationPage"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const AdvertiserRoutes = () => (
  <RouteGuard>
    <Routes>
      {/* Remover a restrição de roles e usar RouteGuard padrão */}
      <Route index element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserDashboard /></Suspense>} />
      
      {/* Mesma lógica para todas as outras rotas */}
      <Route path="campanhas" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserCampaigns /></Suspense>} />
      
      <Route path="cashbacks" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserCashbacksPage /></Suspense>} />
      
      <Route path="nova-campanha" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserNewCampaign /></Suspense>} />
      <Route path="analises" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserAnalytics /></Suspense>} />
      <Route path="creditos" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserCredits /></Suspense>} />
      <Route path="notificacoes" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserNotifications /></Suspense>} />
      <Route path="perfil" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserProfilePage /></Suspense>} />
      <Route path="configuracoes" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserSettings /></Suspense>} />
      <Route path="moderacao" element={<Suspense fallback={<RouteLoadingSpinner />}><ModerationPage /></Suspense>} />
      <Route path="pagamento-sucesso" element={<Suspense fallback={<RouteLoadingSpinner />}><PaymentSuccessPage /></Suspense>} />
      <Route path="pagamento-mock" element={<Suspense fallback={<RouteLoadingSpinner />}><PagamentoMockPage /></Suspense>} />
      <Route path="crm" element={<Suspense fallback={<RouteLoadingSpinner />}><AdvertiserCrmPage /></Suspense>} />
      <Route path="validacao-cupom" element={<Suspense fallback={<RouteLoadingSpinner />}><CouponValidationPage /></Suspense>} />
      
      {/* Catch-all route for 404 handling within advertiser routes */}
      <Route path="*" element={<Suspense fallback={<RouteLoadingSpinner />}><NotFound /></Suspense>} />
    </Routes>
  </RouteGuard>
);

export default AdvertiserRoutes;
