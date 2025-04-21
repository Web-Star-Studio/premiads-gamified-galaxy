
import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserState } from "./UserStateContext";
import { useUserSessionManager } from "./UserSessionManager";
import { useUserProfileOperations } from "./UserProfileOperations";
import { UserContext } from "./UserContext";
import { useDemoCleanupEffect } from "./UserDemoCleanup";
import { UserType } from "@/types/auth";

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

  // Demo user cleanup is now a reusable hook
  useDemoCleanupEffect();

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

    window.location.replace("/");
  }, [resetUserInfo, setIsAuthenticated]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        await checkSession(true);
      } catch (error) {
        setAuthError("Erro ao carregar dados do usuário.");
      } finally {
        setIsAuthLoading(false);
        setInitialCheckDone(true);
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
              setUserType((profileData.user_type || "participante") as UserType);
            } else {
              setUserName(session.user.email?.split('@')[0] || "");
            }
          } catch {
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
      if (isAuthLoading && !initialCheckDone) {
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
