
import { ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserType[];
  userType?: UserType;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner data-testid="route-loading-spinner" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
