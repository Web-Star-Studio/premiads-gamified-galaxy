
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { UserType } from "@/types/auth";

interface RouteGuardProps {
  children: ReactNode;
  userType?: UserType | null;
}

const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    // Check user access based on user type
    const checkAccess = async () => {
      if (!isAuthenticated || !currentUser) {
        setHasAccess(false);
        setChecking(false);
        return;
      }
      
      const userRole = currentUser?.user_metadata?.user_type || 'participante';
      
      // Admin and moderators have access to all routes
      if (userRole === 'admin' || userRole === 'moderator') {
        setHasAccess(true);
        setChecking(false);
        return;
      }
      
      // If no specific userType required, or user has the required type
      if (!userType || userType === userRole) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
      
      setChecking(false);
    };
    
    if (!isLoading) {
      checkAccess();
    }
  }, [isAuthenticated, isLoading, currentUser, userType]);
  
  if (isLoading || checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-galaxy-dark">
        <LoadingSpinner data-testid="route-loading-spinner" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} />;
  }

  // If user doesn't have access, redirect to appropriate dashboard
  if (!hasAccess && currentUser) {
    const userRole = currentUser?.user_metadata?.user_type;
    
    if (userRole === "admin") {
      return <Navigate to="/admin" />;
    } else if (userRole === "moderator") {
      return <Navigate to="/admin" />; // Moderators also go to admin panel
    } else if (userRole === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
