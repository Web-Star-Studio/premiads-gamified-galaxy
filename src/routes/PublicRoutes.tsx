
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

// Lazy load public pages
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Faq = lazy(() => import("@/pages/Faq"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const Tutorials = lazy(() => import("@/pages/Tutorials"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Support = lazy(() => import("@/pages/Support"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const PublicRoutes = () => {
  const { isAuthenticated, currentUser, userType } = useAuth();
  
  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated && currentUser) {
    if (userType === "anunciante") {
      return <Navigate to="/anunciante" replace />;
    } else if (userType === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  }
  
  return (
    <Routes>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <Index />
        </Suspense>
      } />
      <Route path="sobre" element={
        <Suspense fallback={<LoadingSpinner />}>
          <About />
        </Suspense>
      } />
      <Route path="como-funciona" element={
        <Suspense fallback={<LoadingSpinner />}>
          <HowItWorks />
        </Suspense>
      } />
      <Route path="faq" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Faq />
        </Suspense>
      } />
      <Route path="feedback" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Feedback />
        </Suspense>
      } />
      <Route path="tutoriais" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Tutorials />
        </Suspense>
      } />
      <Route path="blog" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Blog />
        </Suspense>
      } />
      <Route path="blog/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <BlogPost />
        </Suspense>
      } />
      <Route path="suporte" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Support />
        </Suspense>
      } />
      
      {/* Redirect /auth to / as we now use an overlay */}
      <Route path="auth" element={<Navigate to="/" replace />} />
      
      {/* Redirect /documentacao to /admin/documentacao */}
      <Route path="documentacao" element={<Navigate to="/admin/documentacao" replace />} />
      
      {/* Catch-all for missing routes */}
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
};

export default PublicRoutes;
