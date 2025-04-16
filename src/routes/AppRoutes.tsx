
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import AdvertiserRoutes from "./AdvertiserRoutes";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Client routes */}
      <Route path="/cliente/*" element={<ClientRoutes />} />
      
      {/* Advertiser routes */}
      <Route path="/anunciante/*" element={<AdvertiserRoutes />} />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
      
      {/* Global catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
