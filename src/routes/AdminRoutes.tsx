import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load admin pages
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const UserManagementPage = lazy(() => import("@/pages/admin/UserManagementPage"));
const LotteryManagementPage = lazy(() => import("@/pages/admin/LotteryManagementPage"));


const NotificationsPage = lazy(() => import("@/pages/admin/NotificationsPage"));
const RulesPage = lazy(() => import("@/pages/admin/RulesPage"));

const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));
const DocumentationPage = lazy(() => import("@/pages/admin/DocumentationPage"));
const ModerationPage = lazy(() => import("@/pages/admin/ModerationPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminRoutes = () => {
  const { isAdmin, loading } = useAdminAuth();

  console.log("AdminRoutes - isAdmin:", isAdmin, "loading:", loading);

  // Show loading state while checking admin status
  if (loading) {
    console.log("AdminRoutes - Showing loading spinner");
    return <RouteLoadingSpinner />;
  }

  // If not admin and not loading, the redirect will happen in useAdminAuth
  if (!isAdmin) {
    console.log("AdminRoutes - User is not admin, returning null");
    return null;
  }

  console.log("AdminRoutes - Rendering admin routes");
  return (
    <Routes>
      <Route 
        index 
        element={
          <ErrorBoundary fallback={<div className="p-8">Erro ao carregar o painel de administração. Tente novamente.</div>}>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <AdminPanel />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="usuarios" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <UserManagementPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="sorteios" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <LotteryManagementPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      

      

      
      <Route 
        path="notificacoes" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <NotificationsPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="regras" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <RulesPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="configuracoes" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <SettingsPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="documentacao" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <DocumentationPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      <Route 
        path="moderacao" 
        element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <ModerationPage />
            </Suspense>
          </ErrorBoundary>
        } 
      />
      
      {/* Catch-all route for 404 handling within admin routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
