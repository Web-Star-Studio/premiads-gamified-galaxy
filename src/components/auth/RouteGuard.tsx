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
    return null;
  }

  const userTypeFromMetadata = currentUser?.user_metadata?.user_type as UserType;
  const effectiveAllowedRoles = allowedRoles || (userType ? [userType] : undefined);

  if (effectiveAllowedRoles && (!userTypeFromMetadata || !effectiveAllowedRoles.includes(userTypeFromMetadata))) {
    if (userTypeFromMetadata === "anunciante") {
      return <Navigate to="/anunciante" replace />;
    } else if (userTypeFromMetadata === "admin" || userTypeFromMetadata === "moderator") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
