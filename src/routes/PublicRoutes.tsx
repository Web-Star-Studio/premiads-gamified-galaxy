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

const PublicRoutes = () => (
  <Suspense fallback={<RouteLoadingSpinner />}>
    <Routes>
      <Route index element={<Index />} />
      <Route path="sobre" element={<About />} />
      <Route path="como-funciona" element={<HowItWorks />} />
      <Route path="faq" element={<Faq />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="tutoriais" element={<Tutorials />} />
      <Route path="auth" element={<Authentication />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:id" element={<BlogPost />} />
      <Route path="suporte" element={<Support />} />
      
      {/* Redirect /documentacao to /admin/documentacao */}
      <Route path="documentacao" element={<Navigate to="/admin/documentacao" replace />} />

      
      <Route path="tour" element={<Tour />} />
      
      <Route path="nosso-time" element={<Team />} />
      
      <Route path="carreiras" element={<Careers />} />
      
      {/* Política e termos legais */}
      <Route path="termos-de-uso" element={<TermsOfUse />} />
      
      <Route path="politica-de-privacidade" element={<PrivacyPolicy />} />
      
      <Route path="cookies" element={<CookiesPolicy />} />
      
      {/* Catch-all for missing routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default PublicRoutes;
