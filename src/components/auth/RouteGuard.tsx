
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

interface RouteGuardProps {
  children: ReactNode;
  userType?: "anunciante" | "participante" | "admin" | null;
}

const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  
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
    const userRole = currentUser?.user_metadata?.user_type;
    
    if (userRole === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
