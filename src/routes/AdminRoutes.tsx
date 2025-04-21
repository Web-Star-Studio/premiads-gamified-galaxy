
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

// Lazy load admin pages
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const UserManagementPage = lazy(() => import("@/pages/admin/UserManagementPage"));
const LotteryManagementPage = lazy(() => import("@/pages/admin/LotteryManagementPage"));
const SystemCleanupPage = lazy(() => import("@/pages/admin/SystemCleanupPage"));
const DocumentationPage = lazy(() => import("@/pages/admin/DocumentationPage"));

const AdminRoutes = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <RouteLoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      {/* Admin routes */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <AdminDashboardPage />
          </Suspense>
        } 
      />
      <Route 
        path="/users" 
        element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <UserManagementPage />
          </Suspense>
        } 
      />
      <Route 
        path="/lottery" 
        element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <LotteryManagementPage />
          </Suspense>
        } 
      />
      <Route 
        path="/cleanup" 
        element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <SystemCleanupPage />
          </Suspense>
        } 
      />
      <Route 
        path="/docs/*" 
        element={
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DocumentationPage />
          </Suspense>
        } 
      />
      
      {/* Redirect all other routes to dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
