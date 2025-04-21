
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { UserType } from "@/types/auth";

interface RouteGuardProps {
  children: ReactNode;
  userType?: UserType;
}

const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const { isAuthenticated, userType: contextUserType, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  // Prevent infinite redirection loops by checking current path
  const isAdminPath = location.pathname.startsWith('/admin');
  const isClientPath = location.pathname.startsWith('/cliente');
  const isAdvertiserPath = location.pathname.startsWith('/anunciante');
  
  console.log("RouteGuard check -", { 
    userType, 
    contextUserType, 
    isAuthenticated, 
    path: location.pathname,
    isAdminPath,
    isClientPath
  });
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to home");
    // Only show toast if trying to access a protected route
    if (location.pathname !== "/") {
      toast({
        title: "Acesso restrito",
        description: "Você precisa fazer login para acessar esta área.",
        variant: "destructive"
      });
    }
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Function to check if user has access to the route
  const hasAccess = () => {
    if (!userType) return true;
    if (!contextUserType) return false;
    
    // Admin-master has access to admin routes
    if (userType === "admin" && contextUserType === "admin-master") {
      return true;
    }
    
    // Direct match
    return contextUserType === userType;
  };

  // Determine where to redirect if access is denied
  const getRedirectPath = () => {
    if (!contextUserType) return "/";
    
    if (contextUserType === "admin" || contextUserType === "admin-master") {
      return "/admin";
    } else if (contextUserType === "anunciante") {
      return "/anunciante";
    } else if (contextUserType === "participante") {
      return "/cliente";
    }
    
    return "/";
  };

  // If userType is specified, check if user has correct type
  if (userType && !hasAccess()) {
    const redirectTo = getRedirectPath();
    
    // Prevent endless redirect loops
    if ((contextUserType === "admin" || contextUserType === "admin-master") && isAdminPath) {
      console.log("Admin user already on admin path, allowing access to prevent loop");
      return <>{children}</>;
    }
    
    if (contextUserType === "participante" && isClientPath) {
      console.log("Client user already on client path, allowing access to prevent loop");
      return <>{children}</>;
    }
    
    if (contextUserType === "anunciante" && isAdvertiserPath) {
      console.log("Advertiser user already on advertiser path, allowing access to prevent loop");
      return <>{children}</>;
    }
    
    // Only redirect and show toast if we're not already at the correct path
    if (location.pathname !== redirectTo) {
      console.log(`User type mismatch. Expected: ${userType}, Got: ${contextUserType}. Redirecting to ${redirectTo}`);
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive"
      });
      
      return <Navigate to={redirectTo} replace />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
