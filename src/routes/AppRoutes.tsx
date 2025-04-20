
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load route components
const PublicRoutes = lazy(() => import("./PublicRoutes"));
const ClientRoutes = lazy(() => import("./ClientRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const AdvertiserRoutes = lazy(() => import("./AdvertiserRoutes"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with suspense loading */}
      <Route path="/*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PublicRoutes />
        </Suspense>
      } />
      
      {/* Client routes with suspense loading */}
      <Route path="/cliente/*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ClientRoutes />
        </Suspense>
      } />
      
      {/* Advertiser routes with suspense loading */}
      <Route path="/anunciante/*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <AdvertiserRoutes />
        </Suspense>
      } />
      
      {/* Admin routes with suspense loading */}
      <Route path="/admin/*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <AdminRoutes />
        </Suspense>
      } />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
      
      {/* Global catch-all route */}
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
};

export default AppRoutes;
