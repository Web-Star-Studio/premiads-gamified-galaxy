
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

// Lazy load route components
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const ClientRoutes = lazy(() => import("./ClientRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const AdvertiserRoutes = lazy(() => import("./AdvertiserRoutes"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("AppRoutes rendered, current path:", location.pathname, "isAuthenticated:", isAuthenticated, "loading:", isLoading);
  
  // Don't render any routes until we've checked auth status
  if (isLoading) {
    return <RouteLoadingSpinner />;
  }
  
  // Helper function to handle redirections for root and auth paths
  const shouldRedirect = () => {
    return isAuthenticated && 
           currentUser && 
           (location.pathname === "/" || location.pathname === "/auth");
  };
  
  // Get appropriate dashboard path based on user type
  const getDashboardPath = () => {
    const userType = currentUser?.user_metadata?.user_type;
    
    if (userType === "participante") return "/cliente";
    if (userType === "anunciante") return "/anunciante";
    if (userType === "admin" || userType === "moderator") return "/admin";
    
    return "/auth"; // Default fallback
  };

  return (
    <Routes>
      {/* Redirect root path for authenticated users */}
      {shouldRedirect() && (
        <Route 
          index 
          element={<Navigate to={getDashboardPath()} replace />} 
        />
      )}
      
      {/* Public routes with suspense loading */}
      <Route path="/*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <PublicRoutes />
        </Suspense>
      } />
      
      {/* Client routes with suspense loading */}
      <Route path="/cliente/*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <ClientRoutes />
        </Suspense>
      } />
      
      {/* Advertiser routes with suspense loading */}
      <Route path="/anunciante/*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdvertiserRoutes />
        </Suspense>
      } />
      
      {/* Admin routes with suspense loading */}
      <Route path="/admin/*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <AdminRoutes />
        </Suspense>
      } />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={location.pathname.slice(0, -1)} replace />} />
      
      {/* Global catch-all route */}
      <Route path="*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
};

export default AppRoutes;
