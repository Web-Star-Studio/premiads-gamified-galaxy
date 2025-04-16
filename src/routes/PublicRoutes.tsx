import { Suspense, lazy, Fragment } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

// Regular import for essential components
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Tutorials from "@/pages/Tutorials";
import Faq from "@/pages/Faq";
import Support from "@/pages/Support";
import About from "@/pages/About";

// New pages
import Tour from "@/pages/Tour";
import HowItWorksPage from "@/pages/HowItWorks";
import Feedback from "@/pages/Feedback";

// Lazy loaded components
const Authentication = lazy(() => import("@/pages/Authentication"));

// Custom loading component for routes
const RouteLoadingSpinner = () => <LoadingSpinner />;

export const PublicRoutes = () => {
  return (
    <Fragment>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Authentication />
        </Suspense>
      } />
      
      {/* Information Pages */}
      <Route path="/tutoriais" element={<Tutorials />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/suporte" element={<Support />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/tour" element={<Tour />} />
      <Route path="/como-funciona" element={<HowItWorksPage />} />
      <Route path="/feedback" element={<Feedback />} />
      
      {/* Not Found Route - Keep at the bottom of routes */}
      <Route path="*" element={<NotFound />} />
    </Fragment>
  );
};

export default PublicRoutes;
