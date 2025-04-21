
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RouteGuardProps {
  children: ReactNode;
  userType?: "participante" | "anunciante" | "admin" | "admin-master";
}

const RouteGuard = ({ children, userType }: RouteGuardProps) => {
  const { isAuthenticated, userType: contextUserType, isAuthLoading, authError, checkSession, initialCheckDone } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    console.log("RouteGuard: Initializing", { isAuthLoading, isAuthenticated, userType: contextUserType });
    
    // Use the centralized checkSession function
    const verifyAuth = async () => {
      try {
        console.log("RouteGuard: Verifying auth");
        await checkSession();
        setIsChecking(false);
      } catch (error) {
        console.error("Error in RouteGuard:", error);
        setIsChecking(false);
      }
    };
    
    if (!initialCheckDone) {
      verifyAuth();
    } else {
      setIsChecking(false);
    }
    
    // Add a timeout to detect if authentication is taking too long
    const timeoutId = setTimeout(() => {
      if (isChecking) {
        console.log("Authentication check is taking longer than expected");
        setAuthTimeout(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [checkSession, initialCheckDone, isAuthLoading, isAuthenticated, contextUserType]);

  // Show error message if auth check takes too long
  if (authTimeout && isChecking) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-galaxy-dark p-4" data-testid="auth-timeout">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-neon-cyan">Verificação de autenticação está demorando muito</h2>
          <p className="text-gray-300">Estamos tendo problemas para verificar sua conta. Isso pode ser devido a problemas de conexão ou serviço.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neon-cyan text-galaxy-dark rounded-md hover:bg-neon-cyan/80 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking authentication
  if ((isAuthLoading || isChecking) && !authTimeout) {
    return (
      <div className="flex h-screen items-center justify-center bg-galaxy-dark" data-testid="route-loading-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated && !isAuthLoading && !isChecking) {
    console.log("RouteGuard: Not authenticated, redirecting to login");
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If the user is admin-master, they can access everything
  if (contextUserType === "admin-master") {
    console.log("RouteGuard: Admin-master access granted");
    return <>{children}</>;
  }

  // If userType is specified, check if user has correct type
  if (userType && contextUserType !== userType && contextUserType !== "admin-master") {
    console.log("RouteGuard: Access denied, wrong user type", { required: userType, actual: contextUserType });
    
    // Show access denied toast
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive"
    });

    // Redirect to appropriate dashboard based on user type
    if (contextUserType === "anunciante") {
      return <Navigate to="/anunciante" replace />;
    } else if (contextUserType === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  }

  // If all checks pass, render the protected route
  console.log("RouteGuard: Access granted");
  return <>{children}</>;
};

export default RouteGuard;
