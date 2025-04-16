
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ClientRoutes } from "./ClientRoutes";
import { AdvertiserRoutes } from "./AdvertiserRoutes";
import { AdminRoutes } from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Include all route groups using React Fragment */}
      <PublicRoutes />
      <ClientRoutes />
      <AdvertiserRoutes />
      <AdminRoutes />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
    </Routes>
  );
};

export default AppRoutes;
