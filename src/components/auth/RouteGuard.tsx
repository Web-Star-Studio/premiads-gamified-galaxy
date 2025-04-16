
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  userType?: "anunciante" | "participante" | "admin" | null;
}

/**
 * A component to protect routes that require authentication
 * Redirects to login page if not authenticated
 * Can optionally check for specific user type
 */
const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-galaxy-dark">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} />;
  }

  // If userType is specified, check if user has correct type
  if (userType && currentUser?.user_metadata?.user_type !== userType) {
    // Redirect to appropriate dashboard based on user type
    if (currentUser?.user_metadata?.user_type === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (currentUser?.user_metadata?.user_type === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
