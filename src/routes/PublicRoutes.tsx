import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Regular import for essential components
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Tutorials from "@/pages/Tutorials";
import Faq from "@/pages/Faq";
import Support from "@/pages/Support";
import About from "@/pages/About";

// Lazy loaded components
const Authentication = lazy(() => import("@/pages/Authentication"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

const PublicRoutes = () => {
  return (
    <>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Authentication />
        </Suspense>
      } />
      
      {/* Páginas informativas */}
      <Route path="/tutoriais" element={<Tutorials />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/suporte" element={<Support />} />
      <Route path="/sobre" element={<About />} />
      
      {/* Not Found Route - Keep at the bottom of routes */}
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default PublicRoutes;
