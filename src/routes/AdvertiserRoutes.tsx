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
    <Suspense fallback={<RouteLoadingSpinner />}>
      <Routes>
        {/* Remover a restrição de roles e usar RouteGuard padrão */}
        <Route index element={<AdvertiserDashboard />} />
        
        {/* Mesma lógica para todas as outras rotas */}
        <Route path="campanhas" element={<AdvertiserCampaigns />} />
        
        <Route path="cashbacks" element={<AdvertiserCashbacksPage />} />
        
        <Route path="nova-campanha" element={<AdvertiserNewCampaign />} />
        <Route path="analises" element={<AdvertiserAnalytics />} />
        <Route path="creditos" element={<AdvertiserCredits />} />
        <Route path="notificacoes" element={<AdvertiserNotifications />} />
        <Route path="perfil" element={<AdvertiserProfilePage />} />
        <Route path="configuracoes" element={<AdvertiserSettings />} />
        <Route path="moderacao" element={<ModerationPage />} />
        <Route path="pagamento-sucesso" element={<PaymentSuccessPage />} />
        <Route path="pagamento-mock" element={<PagamentoMockPage />} />
        <Route path="crm" element={<AdvertiserCrmPage />} />
        <Route path="validacao-cupom" element={<CouponValidationPage />} />
        
        {/* Catch-all route for 404 handling within advertiser routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </RouteGuard>
);

export default AdvertiserRoutes;
