
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";
import { useUserState } from "./UserStateContext";
import { useUserSessionManager } from "./UserSessionManager";
import { useUserProfileOperations } from "./UserProfileOperations";
import { useNavigate } from "react-router-dom";

// The main UserContext type that combines all relevant context values 
type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  resetUserInfo: () => void;
  clearUserSession: () => void;
  saveUserPreferences: () => Promise<void>;
  isAuthLoading: boolean;
  authError: string | null;
  checkSession: (force?: boolean) => Promise<boolean>;
  initialCheckDone: boolean;
};

// Export the context for useContext usage
export const UserContext = createContext<UserContextType>({
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  isAuthenticated: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  setIsAuthenticated: () => {},
  resetUserInfo: () => {},
  clearUserSession: () => {},
  saveUserPreferences: async () => {},
  isAuthLoading: false,
  authError: null,
  checkSession: async () => false,
  initialCheckDone: false,
});

// Hook to use the context
export const useUser = () => useContext(UserContext);

// Provider component that wraps the app and provides the context values
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    userName,
    userType,
    isOverlayOpen,
    isAuthenticated,
    setUserName,
    setUserType,
    setIsOverlayOpen,
    setIsAuthenticated,
    resetUserInfo,
  } = useUserState();

  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState<boolean>(false);
  const [sessionCheckFailed, setSessionCheckFailed] = useState<boolean>(false);

  const { checkSession, authError: sessionAuthError } = useUserSessionManager({
    setUserName,
    setUserType,
    setIsAuthenticated,
    setUserId,
  });

  const { saveUserPreferences } = useUserProfileOperations(
    userId,
    userName,
    userType
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  // Demo user cleanup 
  useEffect(() => {
    const checkAndCleanDemoUser = () => {
      const userName = localStorage.getItem("userName");
      const demoUserEmails = [
        "demo@premiads.com",
        "demo@premiads.app", 
        "demo@demo.com"
      ];
      
      // If the user is auto-logged in as demo, force cleanup!
      if (userName && (
        userName.toLowerCase().includes("demo") || 
        demoUserEmails.some(email => userName.toLowerCase() === email)
      )) {
        console.log("🔥 Demo user detected, cleaning up...");
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/");
      }
    };
    
    checkAndCleanDemoUser();
  }, []);

  const clearUserSession = useCallback(() => {
    resetUserInfo();
    setUserId(null);
    setIsAuthenticated(false);
    setAuthError(null);

    localStorage.removeItem("userName");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userType");
    localStorage.removeItem("lastActivity");

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();

    navigate("/", { replace: true });
  }, [resetUserInfo, setIsAuthenticated, navigate]);

  // Handle session timeout detection
  useEffect(() => {
    if (sessionAuthError && sessionAuthError.includes("expirou")) {
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Você será redirecionado para fazer login novamente.",
        variant: "destructive",
      });
      
      // Add a small delay before logout to ensure toast is visible
      const logoutTimer = setTimeout(() => {
        clearUserSession();
      }, 2000);
      
      return () => clearTimeout(logoutTimer);
    }
  }, [sessionAuthError, clearUserSession, toast]);

  // Handle session checks and authentication state
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        const success = await checkSession(true);
        
        if (!success) {
          setSessionCheckFailed(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setAuthError("Erro ao carregar dados do usuário.");
        setSessionCheckFailed(true);
      } finally {
        setIsAuthLoading(false);
        setInitialCheckDone(true);
      }
    };

    loadUserData();

    // Better timeout handling with fallback
    const loadingTimeoutId = setTimeout(() => {
      if (isAuthLoading && !initialCheckDone) {
        console.log("Auth verification taking longer than expected");
        setIsAuthLoading(false);
        setInitialCheckDone(true);
        setAuthError("A verificação está demorando mais que o esperado. Verifique sua conexão.");
        
        // Make one final attempt to get the session
        setTimeout(async () => {
          try {
            await checkSession(true);
          } catch (error) {
            console.error("Final session check attempt failed:", error);
          }
        }, 1000);
      }
    }, 10000); // 10 seconds timeout

    return () => {
      clearTimeout(loadingTimeoutId);
    };
  }, [
    checkSession,
    resetUserInfo,
    setIsAuthenticated,
    setUserName,
    setUserType,
    isAuthLoading,
    initialCheckDone,
  ]);

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        isOverlayOpen,
        isAuthenticated,
        setUserName,
        setUserType,
        setIsOverlayOpen,
        setIsAuthenticated,
        resetUserInfo,
        clearUserSession,
        saveUserPreferences,
        isAuthLoading,
        authError: authError || sessionAuthError,
        checkSession,
        initialCheckDone,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
