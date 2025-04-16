
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFound from "@/pages/NotFound";

// Lazy load public pages
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Faq = lazy(() => import("@/pages/Faq"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const Tutorials = lazy(() => import("@/pages/Tutorials"));
const Authentication = lazy(() => import("@/pages/Authentication"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Index />
        </Suspense>
      } />
      <Route path="sobre" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <About />
        </Suspense>
      } />
      <Route path="como-funciona" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <HowItWorks />
        </Suspense>
      } />
      <Route path="faq" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Faq />
        </Suspense>
      } />
      <Route path="feedback" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Feedback />
        </Suspense>
      } />
      <Route path="tutoriais" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Tutorials />
        </Suspense>
      } />
      <Route path="auth" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Authentication />
        </Suspense>
      } />
      
      {/* Catch-all route for 404 handling within public routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
