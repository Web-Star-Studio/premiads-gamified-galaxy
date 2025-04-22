import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RouteLoadingSpinner from "@/components/routing/RouteLoadingSpinner";
import NotFound from "@/pages/NotFound";

// Add new lazy imports
const Tour = lazy(() => import("@/pages/Tour"));
const Team = lazy(() => import("@/pages/Team")); 
const Careers = lazy(() => import("@/pages/Careers"));
const TermsOfUse = lazy(() => import("@/pages/legal/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const CookiesPolicy = lazy(() => import("@/pages/legal/CookiesPolicy"));

// Lazy load public pages
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Faq = lazy(() => import("@/pages/Faq"));
const Feedback = lazy(() => import("@/pages/Feedback"));
const Tutorials = lazy(() => import("@/pages/Tutorials"));
const Authentication = lazy(() => import("@/pages/Authentication"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Support = lazy(() => import("@/pages/Support"));

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
      <Route path="blog" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Blog />
        </Suspense>
      } />
      <Route path="blog/:id" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <BlogPost />
        </Suspense>
      } />
      <Route path="suporte" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Support />
        </Suspense>
      } />
      
      {/* Redirect /documentacao to /admin/documentacao */}
      <Route path="documentacao" element={<Navigate to="/admin/documentacao" replace />} />

      
      <Route path="tour" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Tour />
        </Suspense>
      } />
      
      <Route path="nosso-time" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Team />
        </Suspense>
      } />
      
      <Route path="carreiras" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Careers />
        </Suspense>
      } />
      
      {/* Política e termos legais */}
      <Route path="termos-de-uso" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <TermsOfUse />
        </Suspense>
      } />
      
      <Route path="politica-de-privacidade" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <PrivacyPolicy />
        </Suspense>
      } />
      
      <Route path="cookies" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <CookiesPolicy />
        </Suspense>
      } />
      
      {/* Catch-all for missing routes */}
      <Route path="*" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
};

export default PublicRoutes;
