
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
        console.log("Session check throttled, last check was", now - lastAuthCheck, "ms ago");
        return false;
      }
      
      try {
        checkInProgress.current = true;
        setLastAuthCheck(now);
        setAuthError(null);
        
        // Use getSession() to check for a valid session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setAuthError("Error checking your session: " + error.message);
          setIsAuthenticated(false);
          setUserId(null);
          checkInProgress.current = false;
          return false;
        }
        
        if (!data.session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setUserId(null);
          checkInProgress.current = false;
          return false;
        }
        
        // Session found and valid
        console.log("Valid session found for user:", data.session.user.id);
        setIsAuthenticated(true);
        setUserId(data.session.user.id);

        // Use setTimeout to prevent potential auth deadlocks
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
              console.log("Profile data retrieved:", profileData);
              setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || "");
              setUserType(profileData.user_type as UserType || "participante");
            } else {
              console.log("No profile found for user, using email as name");
              setUserName(data.session.user.email?.split('@')[0] || "");
              setUserType("participante");
            }
          } catch (err) {
            console.error("Error in profile fetch:", err);
          } finally {
            checkInProgress.current = false;
          }
        }, 0);
        
        return true;
      } catch (error: any) {
        console.error("Session check failed:", error);
        setAuthError("Session check error: " + (error.message || "Please try again."));
        checkInProgress.current = false;
        return false;
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
