
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/auth/RouteGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";

// Lazy load admin pages
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const UserManagementPage = lazy(() => import("@/pages/admin/UserManagementPage"));
const LotteryManagementPage = lazy(() => import("@/pages/admin/LotteryManagementPage"));
const ReportsPage = lazy(() => import("@/pages/admin/ReportsPage"));
const MonitoringPage = lazy(() => import("@/pages/admin/MonitoringPage"));
const NotificationsPage = lazy(() => import("@/pages/admin/NotificationsPage"));
const RulesPage = lazy(() => import("@/pages/admin/RulesPage"));
const AccessControlPage = lazy(() => import("@/pages/admin/AccessControlPage"));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
const DocumentationPage = lazy(() => import("@/pages/admin/DocumentationPage"));
const ModerationPage = lazy(() => import("@/pages/admin/ModerationPage"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const AdminRoutes = () => {
  return (
    <RouteGuard userType="admin">
      <Routes>
        <Route index element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdminPanel />
          </Suspense>
        } />
        <Route path="usuarios" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <UserManagementPage />
          </Suspense>
        } />
        <Route path="sorteios" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <LotteryManagementPage />
          </Suspense>
        } />
        <Route path="relatorios" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        } />
        <Route path="monitoramento" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <MonitoringPage />
          </Suspense>
        } />
        <Route path="notificacoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <NotificationsPage />
          </Suspense>
        } />
        <Route path="regras" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <RulesPage />
          </Suspense>
        } />
        <Route path="acessos" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AccessControlPage />
          </Suspense>
        } />
        <Route path="configuracoes" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        } />
        <Route path="documentacao" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DocumentationPage />
          </Suspense>
        } />
        <Route path="moderacao" element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ModerationPage />
          </Suspense>
        } />
        
        {/* Catch-all route for 404 handling within admin routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteGuard>
  );
};

export default AdminRoutes;
