
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";

export const useAuthSession = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { setUserName, setUserType, resetUserInfo } = useUser();

  // Check for existing session and set up auth state listener
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        
        try {
          // Set user name from metadata
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", data.session.user.id)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || 'Usuário');
            // Set user type from profile
            setUserType((profileData.user_type || "participante") as UserType);
          } else {
            setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
          setUserType("participante");
        }
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          
          try {
            // Set user name and type from metadata
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type")
              .eq("id", session.user.id)
              .single();
            
            if (error) throw error;
            
            if (profileData) {
              setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
              // Set user type from profile
              setUserType((profileData.user_type || "participante") as UserType);
            } else {
              setUserName(session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante");
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
            setUserName(session.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante");
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          resetUserInfo();
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUserName, setUserType, resetUserInfo]);

  return {
    user,
    loading,
    setLoading
  };
};
