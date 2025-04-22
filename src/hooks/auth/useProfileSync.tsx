
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { UserType, UserProfile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export const useProfileSync = (user: User | null) => {
  const { setUserName, setUserType, resetUserInfo } = useUser();
  const { toast } = useToast();

  const syncUserProfile = async (currentUser: User) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, user_type, profile_completed, active")
        .eq("id", currentUser.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        resetUserInfo();
        return false;
      }
      
      if (profileData) {
        if (!profileData.active) {
          toast({
            title: "Conta desativada",
            description: "Sua conta foi desativada. Entre em contato com o suporte.",
            variant: "destructive"
          });
          
          await supabase.auth.signOut();
          resetUserInfo();
          return false;
        }
        
        setUserName(profileData.full_name || currentUser.email?.split('@')[0] || 'Usuário');
        setUserType((profileData.user_type || "participante") as UserType);
        return true;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      resetUserInfo();
    }
    return false;
  };

  return { syncUserProfile };
};
