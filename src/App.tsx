import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { AppProvider } from "@/context/AppContext";
import LoadingSpinner from "@/components/LoadingSpinner";

// Regular import for essential components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load other pages to reduce initial bundle size
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const ClientMissions = lazy(() => import("./pages/ClientMissions"));
const ClientReferrals = lazy(() => import("./pages/ClientReferrals"));
const ClientRaffles = lazy(() => import("./pages/ClientRaffles"));
const Authentication = lazy(() => import("./pages/Authentication")); // Fixed incorrect path
const AdvertiserDashboard = lazy(() => import("./pages/AdvertiserDashboard"));
const AdvertiserProfile = lazy(() => import("./pages/AdvertiserProfile"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

// Lazy load admin section pages
const LotteryManagementPage = lazy(() => import("./pages/admin/LotteryManagementPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const AccessControlPage = lazy(() => import("./pages/admin/AccessControlPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const MonitoringPage = lazy(() => import("./pages/admin/MonitoringPage"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const RulesPage = lazy(() => import("./pages/admin/RulesPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <UserProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Wrap lazy-loaded routes with Suspense */}
                <Route path="/auth" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Authentication />
                  </Suspense>
                } />
                
                {/* Client Routes */}
                <Route path="/cliente" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ClientDashboard />
                  </Suspense>
                } />
                <Route path="/cliente/missoes" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ClientMissions />
                  </Suspense>
                } />
                <Route path="/cliente/indicacoes" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ClientReferrals />
                  </Suspense>
                } />
                <Route path="/cliente/sorteios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ClientRaffles />
                  </Suspense>
                } />
                <Route path="/cliente/perfil" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ClientProfile />
                  </Suspense>
                } />
                
                {/* Advertiser Routes */}
                <Route path="/anunciante" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdvertiserDashboard />
                  </Suspense>
                } />
                <Route path="/anunciante/perfil" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdvertiserProfile />
                  </Suspense>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminPanel />
                  </Suspense>
                } />
                <Route path="/admin/sorteios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LotteryManagementPage />
                  </Suspense>
                } />
                <Route path="/admin/usuarios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <UserManagementPage />
                  </Suspense>
                } />
                <Route path="/admin/acesso" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AccessControlPage />
                  </Suspense>
                } />
                <Route path="/admin/regras" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <RulesPage />
                  </Suspense>
                } />
                <Route path="/admin/monitoramento" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <MonitoringPage />
                  </Suspense>
                } />
                <Route path="/admin/relatorios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ReportsPage />
                  </Suspense>
                } />
                <Route path="/admin/notificacoes" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotificationsPage />
                  </Suspense>
                } />
                <Route path="/admin/configuracoes" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SettingsPage />
                  </Suspense>
                } />
                
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
