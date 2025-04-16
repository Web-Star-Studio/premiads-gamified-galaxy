
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdminPanel />
        </Suspense>
      } />
      <Route path="sorteios" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <LotteryManagementPage />
        </Suspense>
      } />
      <Route path="usuarios" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <UserManagementPage />
        </Suspense>
      } />
      <Route path="acesso" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AccessControlPage />
        </Suspense>
      } />
      <Route path="regras" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <RulesPage />
        </Suspense>
      } />
      <Route path="monitoramento" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <MonitoringPage />
        </Suspense>
      } />
      <Route path="relatorios" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ReportsPage />
        </Suspense>
      } />
      <Route path="notificacoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <NotificationsPage />
        </Suspense>
      } />
      <Route path="configuracoes" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <SettingsPage />
        </Suspense>
      } />
    </Routes>
  );
};

export default AdminRoutes;
