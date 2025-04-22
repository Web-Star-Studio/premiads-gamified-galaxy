import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import NotFound from "@/pages/NotFound";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import RoleGuard from "@/components/auth/RoleGuard";

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
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdminPanel />
          </Suspense>
        </RoleGuard>
      } />
      
      <Route path="usuarios" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <UserManagementPage />
          </Suspense>
        </RoleGuard>
      } />
      
      <Route path="sorteios" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <LotteryManagementPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="relatorios" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="monitoramento" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <MonitoringPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="notificacoes" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <NotificationsPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="regras" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <RulesPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="acessos" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AccessControlPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="configuracoes" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        </RoleGuard>
      } />
      <Route path="documentacao" element={
        <RoleGuard allowedRoles={["admin", "moderator"]}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DocumentationPage />
          </Suspense>
        </RoleGuard>
      } />
      
      {/* Catch-all route for 404 handling within admin routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
