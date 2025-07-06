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
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage"));
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
      <Routes>
        <Route 
          index 
          element={<Suspense fallback={<RouteLoadingSpinner />}><AdminPanel /></Suspense>} 
        />
        
        <Route 
          path="usuarios" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><UserManagementPage /></Suspense>} 
        />
        
        <Route 
          path="rifas" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><RifasManagementPage /></Suspense>} 
        />
        
        <Route 
          path="sorteios" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><LotteryManagementPage /></Suspense>} 
        />
        
        <Route 
          path="notificacoes" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><NotificationsPage /></Suspense>} 
        />
        
        <Route 
          path="regras" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><RulesPage /></Suspense>} 
        />
        
        <Route 
          path="configuracoes" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><SettingsPage /></Suspense>} 
        />
        
        <Route 
          path="documentacao" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><DocumentationPage /></Suspense>} 
        />
        
        <Route 
          path="moderacao" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><ModerationPage /></Suspense>} 
        />
        
        <Route 
          path="perfil" 
          element={<Suspense fallback={<RouteLoadingSpinner />}><AdminProfilePage /></Suspense>} 
        />
        
        {/* Catch-all route for 404 handling within admin routes */}
        <Route path="*" element={<Suspense fallback={<RouteLoadingSpinner />}><NotFound /></Suspense>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AdminRoutes;
