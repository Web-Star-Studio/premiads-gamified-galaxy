import { Suspense, lazy, useEffect, useRef, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import route components directly (no lazy loading at group level)
import PublicRoutes from "./PublicRoutes";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import AdvertiserRoutes from "./AdvertiserRoutes";

// Keep lazy loading only for NotFound page
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
  
  // Memoize helper functions to avoid recalculations
  const shouldRedirect = useMemo(() => isAuthenticated && 
           currentUser && 
           (location.pathname === "/" || location.pathname === "/auth"), 
           [isAuthenticated, currentUser, location.pathname]);

  const shouldRedirectToAuth = useMemo(() => {
    const protectedPaths = ["/cliente", "/anunciante", "/admin"];
    return !isAuthenticated && protectedPaths.some(path => location.pathname.startsWith(path));
  }, [isAuthenticated, location.pathname]);
  
  const dashboardPath = useMemo(() => {
    const userType = currentUser?.user_metadata?.user_type;
    
    if (userType === "participante") return "/cliente";
    if (userType === "anunciante") return "/anunciante";
    if (userType === "admin" || userType === "moderator") return "/admin";
    
    return "/auth"; // Default fallback
  }, [currentUser?.user_metadata?.user_type]);

  // Don't render any routes until we've checked auth status
  if (isLoading) {
    return <RouteLoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        {/* Redirect to auth if not authenticated and on protected route */}
        {shouldRedirectToAuth && (
          <Route 
            path="*" 
            element={<Navigate to="/auth" replace />} 
          />
        )}
        
        {/* Redirect root path for authenticated users */}
        {shouldRedirect && (
          <Route 
            index 
            element={<Navigate to={dashboardPath} replace />} 
          />
        )}
        
        {/* Public routes - no suspense at group level */}
        <Route path="/*" element={
          <ErrorBoundary>
            <PublicRoutes />
          </ErrorBoundary>
        } />
        
        {/* Client routes - no suspense at group level */}
        <Route path="/cliente/*" element={
          <ErrorBoundary>
            <ClientRoutes />
          </ErrorBoundary>
        } />
        
        {/* Advertiser routes - no suspense at group level */}
        <Route path="/anunciante/*" element={
          <ErrorBoundary>
            <AdvertiserRoutes />
          </ErrorBoundary>
        } />
        
        {/* Admin routes - no suspense at group level */}
        <Route path="/admin/*" element={
          <ErrorBoundary>
            <AdminRoutes />
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
