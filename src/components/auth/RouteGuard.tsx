
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
  const [isChecking, setIsChecking] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const location = useLocation();
  const { toast } = useToast();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    // Check authentication status
    const verifyAuth = async () => {
      // Set a timeout for auth checking
      timeoutId = setTimeout(() => {
        if (isMounted && isChecking) {
          setIsChecking(false);
          
          // If still loading after timeout, increment attempt counter
          if (isLoading) {
            setCheckAttempts(prev => prev + 1);
          }
        }
      }, checkAttempts > 1 ? 2000 : 1000); // Shorter timeout for subsequent attempts
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    };
    
    verifyAuth();
    
    // Add a timeout to detect if authentication is taking too long
    const authTimeoutId = setTimeout(() => {
      if (isMounted && (isChecking || isLoading)) {
        console.log("Authentication check is taking longer than expected");
        setAuthTimeout(true);
        setIsChecking(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (authTimeoutId) clearTimeout(authTimeoutId);
    };
  }, [isChecking, isLoading, checkAttempts]);

  // When loading is complete, update the checking state
  useEffect(() => {
    if (!isLoading && isChecking) {
      setIsChecking(false);
    }
  }, [isLoading, isChecking]);

  // Show error message if auth check takes too long
  if (authTimeout && (isChecking || isLoading)) {
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
  if (isLoading || isChecking) {
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
