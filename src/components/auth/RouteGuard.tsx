
import { ReactNode, useEffect } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserType[];
  userType?: UserType;
}

const RouteGuard = ({ children, allowedRoles, userType }: RouteGuardProps) => {
  const { currentUser, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner data-testid="route-loading-spinner" />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Temporariamente, liberar acesso para todos os usuários autenticados
  return <>{children}</>;
};

export default RouteGuard;
