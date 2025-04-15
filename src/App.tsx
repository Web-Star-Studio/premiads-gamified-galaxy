
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { AppProvider } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";

// Regular import for essential components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tutorials from "./pages/Tutorials";
import Faq from "./pages/Faq";
import Support from "./pages/Support";
import About from "./pages/About";

// Lazy load other pages to reduce initial bundle size
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const ClientMissions = lazy(() => import("./pages/ClientMissions"));
const ClientReferrals = lazy(() => import("./pages/ClientReferrals"));
const ClientRaffles = lazy(() => import("./pages/ClientRaffles"));
const Authentication = lazy(() => import("./pages/Authentication"));
const AdvertiserDashboard = lazy(() => import("./pages/AdvertiserDashboard"));
const AdvertiserProfile = lazy(() => import("./pages/AdvertiserProfile"));

// Lazy load advertiser section pages
const AdvertiserCampaigns = lazy(() => import("./pages/advertiser/AdvertiserCampaigns"));
const AdvertiserNewCampaign = lazy(() => import("./pages/advertiser/NewCampaign"));
const AdvertiserAnalytics = lazy(() => import("./pages/advertiser/AnalyticsPage"));
const AdvertiserCredits = lazy(() => import("./pages/advertiser/CreditsPage"));
const AdvertiserNotifications = lazy(() => import("./pages/advertiser/NotificationsPage"));
const AdvertiserSettings = lazy(() => import("./pages/advertiser/SettingsPage"));

// Lazy load admin section pages
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const LotteryManagementPage = lazy(() => import("./pages/admin/LotteryManagementPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const AccessControlPage = lazy(() => import("./pages/admin/AccessControlPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const MonitoringPage = lazy(() => import("./pages/admin/MonitoringPage"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const RulesPage = lazy(() => import("./pages/admin/RulesPage"));

// Create custom loading component for routes
const RouteLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-galaxy-dark">
    <LoadingSpinner />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

import CashbackMarketplace from "./pages/CashbackMarketplace";

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <UserProvider>
            <TooltipProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <Authentication />
                  </Suspense>
                } />
                
                {/* Páginas informativas */}
                <Route path="/tutoriais" element={<Tutorials />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/suporte" element={<Support />} />
                <Route path="/sobre" element={<About />} />
                
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
                
                {/* Advertiser Routes */}
                <Route path="/anunciante" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserDashboard />
                  </Suspense>
                } />
                <Route path="/anunciante/campanhas" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserCampaigns />
                  </Suspense>
                } />
                <Route path="/anunciante/nova-campanha" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserNewCampaign />
                  </Suspense>
                } />
                <Route path="/anunciante/analises" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserAnalytics />
                  </Suspense>
                } />
                <Route path="/anunciante/creditos" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserCredits />
                  </Suspense>
                } />
                <Route path="/anunciante/notificacoes" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserNotifications />
                  </Suspense>
                } />
                <Route path="/anunciante/perfil" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserProfile />
                  </Suspense>
                } />
                <Route path="/anunciante/configuracoes" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdvertiserSettings />
                  </Suspense>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AdminPanel />
                  </Suspense>
                } />
                <Route path="/admin/sorteios" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <LotteryManagementPage />
                  </Suspense>
                } />
                <Route path="/admin/usuarios" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <UserManagementPage />
                  </Suspense>
                } />
                <Route path="/admin/acesso" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <AccessControlPage />
                  </Suspense>
                } />
                <Route path="/admin/regras" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <RulesPage />
                  </Suspense>
                } />
                <Route path="/admin/monitoramento" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <MonitoringPage />
                  </Suspense>
                } />
                <Route path="/admin/relatorios" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <ReportsPage />
                  </Suspense>
                } />
                <Route path="/admin/notificacoes" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <NotificationsPage />
                  </Suspense>
                } />
                <Route path="/admin/configuracoes" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <SettingsPage />
                  </Suspense>
                } />
                
                {/* Cashback Route */}
                <Route path="/cashback" element={
                  <Suspense fallback={<RouteLoadingSpinner />}>
                    <CashbackMarketplace />
                  </Suspense>
                } />
                
                {/* Redirect URLs com "/" no final para versões sem "/" */}
                <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </UserProvider>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
