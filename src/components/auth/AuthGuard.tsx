
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

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    switch (userType) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "employee":
        return <Navigate to="/employee" replace />;
      case "client":
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
