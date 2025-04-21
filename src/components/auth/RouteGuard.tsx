
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

  // If userType is specified, check if user has correct type
  if (userType && contextUserType !== userType) {
    console.log(`User type mismatch. Expected: ${userType}, Got: ${contextUserType}`);
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive"
    });

    // Redirect to appropriate dashboard based on user type
    switch (contextUserType) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "anunciante":
        return <Navigate to="/anunciante" replace />;
      default:
        return <Navigate to="/cliente" replace />;
    }
  }

  // If all checks pass, render the protected route
  return <>{children}</>;
};

export default RouteGuard;
