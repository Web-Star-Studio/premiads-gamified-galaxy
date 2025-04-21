
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";

export const useActiveUserSession = () => {
  const { isAuthenticated, userType, checkSession, authError } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [sessionCheckTimeout, setSessionCheckTimeout] = useState(false);
  const checkInProgress = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const refreshSession = useCallback(async () => {
    if (checkInProgress.current) {
      console.log("Session refresh already in progress, skipping");
      return;
    }
    
    try {
      checkInProgress.current = true;
      await checkSession(true);
    } catch (error) {
      console.error("Error refreshing session:", error);
      toast({
        title: "Erro ao atualizar sessão",
        description: "Não foi possível atualizar sua sessão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      checkInProgress.current = false;
    }
  }, [checkSession, toast]);

  useEffect(() => {
    console.log("useActiveUserSession: Checking auth status", { isAuthenticated, userType });
    
    const checkAuthStatus = async () => {
      setCheckingStatus(true);
      
      // Set a timeout for checking
      const timeoutId = setTimeout(() => {
        if (checkingStatus) {
          console.log("Auth status check taking too long");
          setSessionCheckTimeout(true);
        }
      }, 10000);
      
      if (!isAuthenticated) {
        console.log("useActiveUserSession: Not authenticated, redirecting to login");
        // Redirect to login if not authenticated
        navigate("/", { replace: true });
        setCheckingStatus(false);
        clearTimeout(timeoutId);
        return;
      }

      // Check user type for admin access
      const hasAdminAccess = userType === "admin";
      setIsAdmin(hasAdminAccess);
      
      // All checks passed, user is active
      setIsActive(true);
      setCheckingStatus(false);
      
      console.log("useActiveUserSession: Auth status checked", { 
        isActive: true, 
        isAdmin: hasAdminAccess
      });
      
      clearTimeout(timeoutId);
    };

    checkAuthStatus();
    
    // Set up periodic session refresh (every 15 minutes)
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 15 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated, userType, navigate, refreshSession]);

  // Display toast on auth error
  useEffect(() => {
    if (authError) {
      toast({
        title: "Problema de autenticação",
        description: authError,
        variant: "destructive"
      });
    }
  }, [authError, toast]);

  return { 
    isActive, 
    isAdmin, 
    refreshSession,
    isChecking: checkingStatus,
    sessionCheckTimeout
  };
};
