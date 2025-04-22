
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
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(session.user);
        
        try {
          // Fetch user profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, user_type, profile_completed, active")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            resetUserInfo();
            return;
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
              setUser(null);
              return;
            }
            
            setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as UserType);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          resetUserInfo();
        }
      } catch (error) {
        console.error("Error in session check:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, user_type, profile_completed, active")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            resetUserInfo();
            return;
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
              setUser(null);
              return;
            }
            
            setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as UserType);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          resetUserInfo();
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setUser(null);
        resetUserInfo();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setUserName, setUserType, resetUserInfo, toast]);

  return {
    user,
    loading,
    setLoading
  };
};
