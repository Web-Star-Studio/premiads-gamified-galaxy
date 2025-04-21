
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
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setUser(data.session.user);
          
          try {
            // Set user name from metadata
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type, profile_completed")
              .eq("id", data.session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching profile:", error);
              throw error;
            }
            
            if (profileData) {
              setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || 'Usuário');
              // Set user type from profile with proper type casting
              const userType = (profileData.user_type || "participante") as UserType;
              setUserType(userType);
              
              // Check if profile is incomplete and show toast
              if (!profileData.profile_completed) {
                toast({
                  title: "Perfil incompleto",
                  description: "Complete seu perfil para obter todas as funcionalidades.",
                });
              }
            } else {
              setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante" as UserType);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
            setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante" as UserType);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
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
          
          try {
            // Set user name and type from metadata
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type, profile_completed")
              .eq("id", session.user.id)
              .single();
            
            if (error) throw error;
            
            if (profileData) {
              setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
              // Set user type from profile with proper type casting
              const userType = (profileData.user_type || "participante") as UserType;
              setUserType(userType);
              
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
