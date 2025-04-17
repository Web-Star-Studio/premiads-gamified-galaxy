
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import HowItWorks from "@/pages/HowItWorks";
import Faq from "@/pages/Faq";
import Feedback from "@/pages/Feedback";
import Tutorials from "@/pages/Tutorials";
import Authentication from "@/pages/Authentication";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

const PublicRoutes = () => {
  return (
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
      
      {/* Catch-all for missing routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
