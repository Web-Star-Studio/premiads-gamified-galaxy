
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { UserType } from "@/types/auth";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserType[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(userType)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
    }
  }, [isLoading, isAuthenticated, userType, allowedRoles, toast]);

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If role check is enabled and user doesn't have required role
  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Redirect based on user role
    if (userType === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userType === "employee") {
      return <Navigate to="/employee" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default AuthGuard;
