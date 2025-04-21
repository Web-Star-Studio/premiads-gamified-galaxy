
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
  const { isAuthenticated, userType: contextUserType, isLoading, currentUser } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const [authTimeout, setAuthTimeout] = useState(false);
  
  // Set up a single timeout for auth check
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Only set timeout if we're still loading
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Authentication check timeout reached");
        setAuthTimeout(true);
      }, 5000); // 5 second timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Show error message if auth check takes too long
  if (authTimeout && isLoading) {
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    toast({
      title: "Acesso restrito",
      description: "Você precisa fazer login para acessar esta área.",
      variant: "destructive"
    });
    
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If userType is specified, check if user has correct type
  if (userType && contextUserType !== userType) {
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
  return <>{children}</>;
};

export default RouteGuard;
