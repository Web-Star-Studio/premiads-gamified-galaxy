
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

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

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const AdminRoutes = () => {
  const location = useLocation();
  const { isAdmin, loading } = useAdminAuth();
  
  useEffect(() => {
    console.log("AdminRoutes rendered, current path:", location.pathname);
  }, [location]);

  // Show loading state while checking admin status
  if (loading) {
    return <RouteLoadingSpinner />;
  }

  // If not admin, redirect to appropriate page
  if (!isAdmin) {
    return <Navigate to="/auth" />;
  }

  return (
    <Routes>
      <Route index element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdminPanel />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="usuarios" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <UserManagementPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="sorteios" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <LotteryManagementPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="relatorios" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="monitoramento" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <MonitoringPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="notificacoes" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <NotificationsPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="regras" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <RulesPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="acessos" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AccessControlPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="configuracoes" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        </RouteGuard>
      } />
      <Route path="documentacao" element={
        <RouteGuard userType="admin">
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DocumentationPage />
          </Suspense>
        </RouteGuard>
      } />
      
      {/* Catch-all route for 404 handling within admin routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
