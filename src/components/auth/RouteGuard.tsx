
import { ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserType[];
  userType?: UserType; // Add this prop to support the previous API
}

const RouteGuard = ({ children, allowedRoles, userType }: RouteGuardProps) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  // Get user type from metadata
  const userTypeFromMetadata = currentUser?.user_metadata?.user_type as UserType;
  
  console.log("RouteGuard - Current user type:", userTypeFromMetadata);
  
  // Convert single userType prop to allowedRoles array for backward compatibility
  const effectiveAllowedRoles = allowedRoles || (userType ? [userType] : undefined);
  
  console.log("RouteGuard - Allowed roles:", effectiveAllowedRoles);
  
  // If roles are specified, check if user has permission
  if (effectiveAllowedRoles && (!userTypeFromMetadata || !effectiveAllowedRoles.includes(userTypeFromMetadata))) {
    console.log("Access denied - Redirecting based on user type");
    
    // Redirect based on user type
    if (userTypeFromMetadata === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (userTypeFromMetadata === "admin" || userTypeFromMetadata === "moderator") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/cliente" />;
    }
  }
  
  // If no roles specified or user has permission, render children
  return <>{children}</>;
};

export default RouteGuard;
