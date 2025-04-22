import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Lazy load route components
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const ClientRoutes = lazy(() => import("./ClientRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const AdvertiserRoutes = lazy(() => import("./AdvertiserRoutes"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auto-redirect authenticated users at root or /auth
    if (
      isAuthenticated &&
      currentUser &&
      (location.pathname === "/" || location.pathname === "/auth")
    ) {
      const userType = currentUser?.user_metadata?.user_type;
      if (userType === "participante") {
        navigate("/cliente", { replace: true });
      } else if (userType === "anunciante") {
        navigate("/anunciante", { replace: true });
      } else if (userType === "admin" || userType === "moderator") {
        navigate("/admin", { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, location.pathname, navigate]);

  return (
    <Routes>
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
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
      
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
