
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast"; 

export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { setUserName, setUserType, resetUserInfo } = useUser();
  const { toast } = useToast();

  // Check for existing session and set up auth state listener
  useEffect(() => {
    // First check for token expiration
    const checkTokenExpiration = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          resetUserInfo();
          return null;
        }
        
        // Check token expiration
        const expiresAt = data.session.expires_at;
        if (expiresAt && expiresAt * 1000 < Date.now()) {
          // Token has expired, sign the user out
          console.log("Session expired, logging out");
          await supabase.auth.signOut();
          resetUserInfo();
          return null;
        }
        
        return data.session.user;
      } catch (error) {
        console.error("Error checking token expiration:", error);
        return null;
      }
    };
    
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Check if token is valid
        const validUser = await checkTokenExpiration();
        if (!validUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(validUser);
        
        try {
          // Now check if account is still active
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type, profile_completed, active")
            .eq("id", validUser.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            throw error;
          }
          
          if (profileData) {
            // Check if account is active
            if (profileData.active === false) {
              console.log("Account inactive, logging out");
              // Account has been deactivated
              toast({
                title: "Conta desativada",
                description: "Sua conta foi desativada. Entre em contato com o suporte.",
                variant: "destructive"
              });
              
              await supabase.auth.signOut();
              resetUserInfo();
              setUser(null);
              setLoading(false);
              return;
            }
            
            setUserName(profileData.full_name || validUser.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as UserType);
            
            // Check if profile is incomplete and show toast
            if (!profileData.profile_completed) {
              toast({
                title: "Perfil incompleto",
                description: "Complete seu perfil para obter todas as funcionalidades.",
              });
            }
          } else {
            setUserName(validUser.email?.split('@')[0] || 'Usuário');
            setUserType("participante" as UserType);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUserName(validUser.email?.split('@')[0] || 'Usuário');
          setUserType("participante" as UserType);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          
          // Using setTimeout to avoid deadlocks in Supabase auth
          setTimeout(async () => {
            try {
              // Set user name and type from metadata
              const { data: profileData, error } = await supabase
                .from("profiles")
                .select("full_name, user_type, profile_completed, active")
                .eq("id", session.user.id)
                .single();
              
              if (error) throw error;
              
              if (profileData) {
                // Check if account is active
                if (profileData.active === false) {
                  // Account has been deactivated
                  toast({
                    title: "Conta desativada",
                    description: "Sua conta foi desativada. Entre em contato com o suporte.",
                    variant: "destructive"
                  });
                  
                  await supabase.auth.signOut();
                  resetUserInfo();
                  setUser(null);
                  return;
                }
                
                setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
                setUserType((profileData.user_type || "participante") as UserType);
                
                // Check if profile is incomplete and show toast
                if (!profileData.profile_completed) {
                  toast({
                    title: "Perfil incompleto",
                    description: "Complete seu perfil para obter todas as funcionalidades.",
                  });
                }
              } else {
                setUserName(session.user.email?.split('@')[0] || 'Usuário');
                setUserType("participante" as UserType);
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              setUserName(session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante" as UserType);
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          resetUserInfo();
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUserName, setUserType, resetUserInfo, toast]);

  return {
    user,
    loading,
    setLoading
  };
};
