
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import AdvertiserRoutes from "./AdvertiserRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Include route components properly */}
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/cliente/*" element={<ClientRoutes />} />
      <Route path="/anunciante/*" element={<AdvertiserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Redirect URLs with "/" at the end to versions without "/" */}
      <Route path="/*/" element={<Navigate to={window.location.pathname.slice(0, -1)} replace />} />
    </Routes>
  );
};

export default AppRoutes;
