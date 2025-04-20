
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  userType?: "participante" | "anunciante" | "admin";
}

const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-galaxy-dark">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Get user's role from metadata
  const userRole = currentUser?.user_metadata?.user_type || 'participante';

  // If userType is specified, check if user has correct type
  if (userType && userRole !== userType) {
    // Show access denied toast
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive"
    });

    // Redirect to appropriate dashboard based on user type
    if (userRole === "anunciante") {
      return <Navigate to="/anunciante" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
