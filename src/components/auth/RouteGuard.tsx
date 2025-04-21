
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
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  
  // Determine route paths once to avoid recalculations
  const isAdminPath = location.pathname.startsWith('/admin');
  const isClientPath = location.pathname.startsWith('/cliente');
  const isAdvertiserPath = location.pathname.startsWith('/anunciante');
  
  // Handle all authorization and redirection logic in a single effect
  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) {
      return;
    }

    console.log("RouteGuard check -", { 
      userType, 
      contextUserType, 
      isAuthenticated, 
      path: location.pathname,
      isAdminPath,
      isClientPath,
      isAdvertiserPath
    });

    // Function to determine the appropriate redirect path for the user
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

    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      // Only show toast for protected routes
      if (location.pathname !== "/") {
        toast({
          title: "Acesso restrito",
          description: "Você precisa fazer login para acessar esta área.",
          variant: "destructive"
        });
        setShouldRedirect("/");
      }
      return;
    }

    // If this is a protected route with specific user type requirements
    if (userType) {
      // Check if user has correct type
      const hasAccess = () => {
        if (!contextUserType) return false;
        
        // Admin-master has access to admin routes
        if (userType === "admin" && contextUserType === "admin-master") {
          return true;
        }
        
        // Direct match
        return contextUserType === userType;
      };

      if (!hasAccess()) {
        const redirectTo = getRedirectPath();
        
        // Prevent endless redirect loops
        if ((contextUserType === "admin" || contextUserType === "admin-master") && isAdminPath) {
          console.log("Admin user already on admin path, allowing access to prevent loop");
          return;
        }
        
        if (contextUserType === "participante" && isClientPath) {
          console.log("Client user already on client path, allowing access to prevent loop");
          return;
        }
        
        if (contextUserType === "anunciante" && isAdvertiserPath) {
          console.log("Advertiser user already on advertiser path, allowing access to prevent loop");
          return;
        }
        
        // Only redirect and show toast if we're not already at the correct path
        if (location.pathname !== redirectTo) {
          console.log(`User type mismatch. Expected: ${userType}, Got: ${contextUserType}. Redirecting to ${redirectTo}`);
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta área.",
            variant: "destructive"
          });
          
          setShouldRedirect(redirectTo);
        }
      }
    }
  }, [isAuthenticated, contextUserType, userType, location.pathname, isLoading, toast, isAdminPath, isClientPath, isAdvertiserPath]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // Handle redirects outside of the render phase
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} state={{ from: location.pathname }} replace />;
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
