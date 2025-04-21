
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

  // Load user data and subscribe to auth changes
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        await checkSession(true);
      } catch (error) {
        setAuthError("Erro ao carregar dados do usuário.");
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
            setUserName(session.user.email?.split('@')[0] || "");
          }
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
        }
      }
    );

    const loadingTimeout = setTimeout(() => {
      if (isAuthLoading) {
        setIsAuthLoading(false);
        setAuthError("A verificação está demorando mais que o esperado. Verifique sua conexão.");
      }
    }, 10000);

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
        saveUserPreferences,
        isAuthLoading,
        authError: authError || sessionAuthError,
        checkSession,
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
