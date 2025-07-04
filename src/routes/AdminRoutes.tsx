import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load admin pages
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const UserManagementPage = lazy(() => import("@/pages/admin/UserManagementPage"));
const LotteryManagementPage = lazy(() => import("@/pages/admin/LotteryManagementPage"));
const RifasManagementPage = lazy(() => import("@/pages/admin/RifasManagementPage"));

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
    <ErrorBoundary fallback={<div className="p-8">Ocorreu um erro. Tente novamente mais tarde.</div>}>
      <Suspense fallback={<RouteLoadingSpinner />}>
        <Routes>
          <Route 
            index 
            element={<AdminPanel />} 
          />
          
          <Route 
            path="usuarios" 
            element={<UserManagementPage />} 
          />
          
          <Route 
            path="rifas" 
            element={<RifasManagementPage />} 
          />
          
          <Route 
            path="sorteios" 
            element={<LotteryManagementPage />} 
          />
          
          <Route 
            path="notificacoes" 
            element={<NotificationsPage />} 
          />
          
          <Route 
            path="regras" 
            element={<RulesPage />} 
          />
          
          <Route 
            path="configuracoes" 
            element={<SettingsPage />} 
          />
          
          <Route 
            path="documentacao" 
            element={<DocumentationPage />} 
          />
          
          <Route 
            path="moderacao" 
            element={<ModerationPage />} 
          />
          
          {/* Catch-all route for 404 handling within admin routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AdminRoutes;
