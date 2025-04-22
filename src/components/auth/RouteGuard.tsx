
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

  useEffect(() => {
    // If authenticated, redirect to the appropriate dashboard if accessing login or root
    if (
      isAuthenticated &&
      currentUser &&
      (location.pathname === "/" || location.pathname === "/auth")
    ) {
      const userTypeFromMetadata = currentUser?.user_metadata?.user_type as UserType;
      if (userTypeFromMetadata === "participante") {
        navigate("/cliente", { replace: true });
      } else if (userTypeFromMetadata === "anunciante") {
        navigate("/anunciante", { replace: true });
      } else if (userTypeFromMetadata === "admin" || userTypeFromMetadata === "moderator") {
        navigate("/admin", { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, location.pathname, navigate]);

  if (isLoading) {
    return <LoadingSpinner data-testid="route-loading-spinner" />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Get user type from metadata or user_metadata
  const userTypeFromMetadata = currentUser?.user_metadata?.user_type as UserType;

  // Convert single userType prop to allowedRoles array for backward compatibility
  const effectiveAllowedRoles = allowedRoles || (userType ? [userType] : undefined);

  // If roles are specified, check if user has permission
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

