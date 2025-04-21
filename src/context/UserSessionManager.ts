
import { useCallback, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";

export const useUserSessionManager = ({
  setUserName,
  setUserType,
  setIsAuthenticated,
  setUserId,
}: {
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setUserId: (id: string | null) => void;
}) => {
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const checkInProgress = useRef<boolean>(false);

  const checkSession = useCallback(
    async (force?: boolean): Promise<boolean> => {
      const now = Date.now();
      
      // Prevent multiple concurrent session checks
      if (checkInProgress.current) {
        console.log("Session check already in progress, skipping");
        return false;
      }
      
      // Throttle checks unless forced
      if (!force && lastAuthCheck && now - lastAuthCheck < 5000) {
        return false;
      }
      
      try {
        checkInProgress.current = true;
        setLastAuthCheck(now);
        setAuthError(null);
        
        // Wrap Supabase call in a Promise.race with a timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout ao verificar sessão")), 10000);
        });
        
        const { data, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: any, error: any };
        
        if (error) {
          console.error("Error checking session:", error);
          setAuthError("Erro ao verificar sua sessão: " + error.message);
          setIsAuthenticated(false);
          setUserId(null);
          return false;
        }
        
        if (!data.session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setUserId(null);
          return false;
        }
        
        // Check if session has expired
        const expiresAt = data.session.expires_at;
        if (expiresAt && new Date(expiresAt * 1000) < new Date()) {
          console.log("Session has expired, logging out");
          setAuthError("Sua sessão expirou. Por favor, faça login novamente.");
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setUserId(null);
          return false;
        }
        
        // Verify email confirmation status if needed
        const user = data.session.user;
        if (user && !user.email_confirmed_at && user.confirmation_sent_at) {
          // Only show warning if confirmation was sent but not confirmed
          console.log("User email not confirmed");
          setAuthError("Por favor, confirme seu email para acesso completo.");
        } else {
          setAuthError(null);
        }
        
        setIsAuthenticated(true);
        setUserId(data.session.user.id);

        // Fetch user profile with a separate timeout to prevent deadlock
        setTimeout(async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("full_name, user_type")
              .eq("id", data.session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              return;
            }

            if (profileData) {
              setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || "");
              setUserType(profileData.user_type as UserType || "participante");
            } else {
              setUserName(data.session.user.email?.split('@')[0] || "");
            }
          } catch (err) {
            console.error("Error in profile fetch:", err);
          }
        }, 0);
        
        return true;
      } catch (error: any) {
        console.error("Session check failed:", error);
        setAuthError("Erro ao verificar sessão: " + (error.message || "Tente novamente."));
        return false;
      } finally {
        checkInProgress.current = false;
      }
    },
    [lastAuthCheck, setIsAuthenticated, setUserId, setUserName, setUserType]
  );

  return {
    checkSession,
    authError,
    setAuthError,
  };
};
