
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { useUser } from "@/context/UserContext";
import { Profile } from "@/types";

export const useFetchUserData = () => {
  const { playSound } = useSounds();
  const { setUserName } = useUser();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  const fetchUserData = async () => {
    console.log("Fetching user data, attempt:", fetchAttempts + 1);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        setAuthError("Erro ao verificar sua sessão. Por favor, faça login novamente.");
        setLoading(false);
        return false;
      }
      
      if (!session) {
        console.log("No active session found");
        if (fetchAttempts >= 2) {
          setAuthError("Sessão não encontrada. Por favor, faça login novamente.");
        }
        setLoading(false);
        return false;
      }
      
      const userId = session.user.id;
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Profile error:", profileError);
        if (fetchAttempts >= 2) {
          setAuthError("Problema ao carregar seu perfil. Por favor, recarregue a página.");
        }
        setLoading(false);
        return false;
      }
      
      if (profileData) {
        // Convert profile_data to the proper type for Profile
        const typedProfile: Profile = {
          ...profileData,
          profile_data: profileData.profile_data as Record<string, any>,
          user_type: (profileData.user_type || "participante") as "participante" | "anunciante" | "admin"
        };
        
        if (typedProfile.full_name) {
          setUserName(typedProfile.full_name);
        }
        
        localStorage.setItem("lastActivity", Date.now().toString());
        setLoading(false);
        playSound("chime");
        return { success: true, profile: typedProfile };
      }
      
      setLoading(false);
      return false;
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (fetchAttempts >= 2) {
        setAuthError("Erro ao buscar seus dados. Por favor, tente novamente.");
      }
      setLoading(false);
      return false;
    }
  };

  return {
    fetchUserData,
    authError,
    setAuthError,
    loading,
    setLoading,
    fetchAttempts,
    setFetchAttempts
  };
};
