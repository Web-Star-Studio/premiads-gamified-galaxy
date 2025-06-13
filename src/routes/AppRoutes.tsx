import { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load route components
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const ClientRoutes = lazy(() => import("./ClientRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const AdvertiserRoutes = lazy(() => import("./AdvertiserRoutes"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();
  const renderCountRef = useRef(0);
  
  // Controle para evitar logs excessivos
  useEffect(() => {
    renderCountRef.current += 1;
    if (renderCountRef.current <= 2 || renderCountRef.current % 10 === 0) {
      console.log("AppRoutes rendered, current path:", location.pathname, "isAuthenticated:", isAuthenticated, "loading:", isLoading);
    }
  }, [location.pathname, isAuthenticated, isLoading]);
  
  // Helper function to handle redirections for root and auth paths
  const shouldRedirect = () => isAuthenticated && 
           currentUser && 
           (location.pathname === "/" || location.pathname === "/auth");
  
  // Get appropriate dashboard path based on user type
  const getDashboardPath = () => {
    const userType = currentUser?.user_metadata?.user_type;
    
    if (userType === "participante") return "/cliente";
    if (userType === "anunciante") return "/anunciante";
    if (userType === "admin" || userType === "moderator") return "/admin";
    
    return "/auth"; // Default fallback
  };

  // Don't render any routes until we've checked auth status
  if (isLoading) {
    return <RouteLoadingSpinner />;
  }

  return (
    <ErrorBoundary>
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
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <PublicRoutes />
            </Suspense>
          </ErrorBoundary>
        } />
        
        {/* Client routes with suspense loading */}
        <Route path="/cliente/*" element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <ClientRoutes />
            </Suspense>
          </ErrorBoundary>
        } />
        
        {/* Advertiser routes with suspense loading */}
        <Route path="/anunciante/*" element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <AdvertiserRoutes />
            </Suspense>
          </ErrorBoundary>
        } />
        
        {/* Admin routes with suspense loading */}
        <Route path="/admin/*" element={
          <ErrorBoundary>
            <Suspense fallback={<RouteLoadingSpinner />}>
              <AdminRoutes />
            </Suspense>
          </ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default AppRoutes;
