
import { useCallback, useState } from "react";
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

  const checkSession = useCallback(
    async (force?: boolean): Promise<boolean> => {
      const now = Date.now();
      if (!force && lastAuthCheck && now - lastAuthCheck < 5000) {
        return;
      }
      setLastAuthCheck(now);
      try {
        setAuthError(null);
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setAuthError("Erro ao verificar sua sessão.");
          setIsAuthenticated(false);
          setUserId(null);
          return false;
        }
        if (!data.session) {
          setIsAuthenticated(false);
          setUserId(null);
          return false;
        }
        setIsAuthenticated(true);
        setUserId(data.session.user.id);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, user_type")
          .eq("id", data.session.user.id)
          .single();

        if (profileData) {
          setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || "");
          setUserType(profileData.user_type as UserType || "participante");
        } else {
          setUserName(data.session.user.email?.split('@')[0] || "");
        }
        return true;
      } catch (error) {
        setAuthError("Erro ao verificar sessão. Tente novamente.");
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
