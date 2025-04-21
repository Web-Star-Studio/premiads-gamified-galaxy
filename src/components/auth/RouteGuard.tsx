
import { ReactNode, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  userType?: "anunciante" | "participante" | "admin" | null;
}

/**
 * A component to protect routes that require authentication
 * Uses mock authentication for now - will be replaced with Supabase
 */
const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authentication for development
  const [currentUserType, setCurrentUserType] = useState<string | null>("participante"); // Mock user type

  // Simulate authentication check delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // For development, routes are authenticated by default 
      // This will be replaced with actual Supabase auth checks
      const mockAuth = localStorage.getItem("mockAuth");
      
      if (mockAuth === "false") {
        setIsAuthenticated(false);
      }
      
      // Get mock user type from localStorage
      const storedUserType = localStorage.getItem("userType");
      if (storedUserType) {
        setCurrentUserType(storedUserType);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
  if (userType && currentUserType !== userType) {
    // Redirect to appropriate dashboard based on user type
    if (currentUserType === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (currentUserType === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
