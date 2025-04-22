
import { ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserType[];
}

const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  // Get user type from metadata
  const userType = currentUser?.user_metadata?.user_type as UserType;
  
  console.log("RouteGuard - Current user type:", userType);
  console.log("RouteGuard - Allowed roles:", allowedRoles);
  
  // If roles are specified, check if user has permission
  if (allowedRoles && (!userType || !allowedRoles.includes(userType))) {
    console.log("Access denied - Redirecting based on user type");
    
    // Redirect based on user type
    if (userType === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (userType === "admin" || userType === "moderator") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }
  
  // If no roles specified or user has permission, render children
  return <>{children}</>;
};

export default RouteGuard;
