
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

    // Set up auth listener with deadlock prevention
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("full_name, user_type")
                .eq("id", session.user.id)
                .maybeSingle();

              if (profileData) {
                setUserName(profileData.full_name || session.user.email?.split('@')[0] || "");
                setUserType((profileData.user_type || "participante") as UserType);
              } else {
                setUserName(session.user.email?.split('@')[0] || "");
              }
            } catch (error) {
              console.error("Error fetching profile after sign in:", error);
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed successfully");
        } else if (event === "USER_UPDATED") {
          console.log("User data updated");
          
          // Refresh session data after update
          setTimeout(async () => {
            await checkSession(true);
          }, 0);
        }
      }
    );

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
    }, 10000); // Increased to 10s

    return () => {
      authListener.subscription.unsubscribe();
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
