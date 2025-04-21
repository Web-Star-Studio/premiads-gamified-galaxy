import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserStateProvider, useUserState } from "./UserStateContext";
import { useUserSessionManager } from "./UserSessionManager";
import { useUserProfileOperations } from "./UserProfileOperations";

// Combines state, session logic, and profile save in one provider
const UserContext = React.createContext<any>(null);

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

  // Session manager (handles session checking)
  const { checkSession, authError: sessionAuthError } = useUserSessionManager({
    setUserName,
    setUserType,
    setIsAuthenticated,
    setUserId,
  });

  // Handles profile saving
  const { saveUserPreferences } = useUserProfileOperations(
    userId,
    userName,
    userType
  );
  const { toast } = useToast();

  // Add an explicit method to clear user session
  const clearUserSession = useCallback(() => {
    console.log("UserContext: Clearing user session [forced]");
    resetUserInfo();
    setUserId(null);
    setIsAuthenticated(false);
    setAuthError(null);

    // Clear any user data from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userType");
    localStorage.removeItem("lastActivity");

    // Remove any Supabase session/storage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();

    // Hard reload to fully reset (as last resort)
    window.location.replace("/");
  }, [resetUserInfo]);

  // Load user data and subscribe to auth changes
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        await checkSession(true);
      } catch (error) {
        console.error("Error loading user data:", error);
        setAuthError("Erro ao carregar dados do usuário.");
      } finally {
        setIsAuthLoading(false);
        setInitialCheckDone(true);
      }
    };

    loadUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);

          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("full_name, user_type")
              .eq("id", session.user.id)
              .single();

            if (profileData) {
              setUserName(profileData.full_name || session.user.email?.split('@')[0] || "");
              setUserType(profileData.user_type as UserType || "participante");
            } else {
              setUserName(session.user.email?.split('@')[0] || "");
            }
          } catch (error) {
            console.error("Error fetching profile after sign in:", error);
            setUserName(session.user.email?.split('@')[0] || "");
          }
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isAuthLoading && !initialCheckDone) {
        console.log("Auth check timed out");
        setIsAuthLoading(false);
        setInitialCheckDone(true);
        setAuthError("A verificação está demorando mais que o esperado. Verifique sua conexão.");
      }
    }, 5000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(loadingTimeout);
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

  // Return value merges all context and features
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

export const useUser = () => React.useContext(UserContext);

// Wrap UserProvider with state provider (for clean separation)
export const UserRootProvider = ({ children }: { children: ReactNode }) => (
  <UserStateProvider>
    <UserProvider>{children}</UserProvider>
  </UserStateProvider>
);
