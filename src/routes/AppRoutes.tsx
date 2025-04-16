
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ClientRoutes } from "./ClientRoutes";
import { AdvertiserRoutes } from "./AdvertiserRoutes";
import { AdminRoutes } from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Include all route groups */}
      <PublicRoutes />
      <ClientRoutes />
      <AdvertiserRoutes />
      <AdminRoutes />
      
      {/* Redirect URLs com "/" no final para versões sem "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
    </Routes>
  );
};

export default AppRoutes;
