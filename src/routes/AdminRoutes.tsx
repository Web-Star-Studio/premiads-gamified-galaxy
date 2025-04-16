
import { Suspense, lazy, Fragment } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load admin pages
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const LotteryManagementPage = lazy(() => import("@/pages/admin/LotteryManagementPage"));
const UserManagementPage = lazy(() => import("@/pages/admin/UserManagementPage"));
const AccessControlPage = lazy(() => import("@/pages/admin/AccessControlPage"));
const ReportsPage = lazy(() => import("@/pages/admin/ReportsPage"));
const MonitoringPage = lazy(() => import("@/pages/admin/MonitoringPage"));
const NotificationsPage = lazy(() => import("@/pages/admin/NotificationsPage"));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
const RulesPage = lazy(() => import("@/pages/admin/RulesPage"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

export const AdminRoutes = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default AdminRoutes;
