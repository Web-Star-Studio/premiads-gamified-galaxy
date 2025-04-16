
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import AdvertiserRoutes from "./AdvertiserRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <PublicRoutes />

      {/* Client Routes */}
      <ClientRoutes />
      
      {/* Advertiser Routes */}
      <AdvertiserRoutes />
      
      {/* Admin Routes */}
      <AdminRoutes />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
    </Routes>
  );
};

export default AppRoutes;
