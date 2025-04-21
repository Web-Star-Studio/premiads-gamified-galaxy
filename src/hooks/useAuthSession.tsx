
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast"; 

export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);
  const { setUserName, setUserType, resetUserInfo } = useUser();
  const { toast } = useToast();

  // Check for existing session and set up auth state listener
  useEffect(() => {
    console.log("useAuthSession: Initializing");
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        console.log("useAuthSession: Checking session");
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("useAuthSession: Session error", error);
          if (isMounted) {
            setSessionCheckComplete(true);
            setLoading(false);
          }
          return;
        }
        
        if (data.session) {
          console.log("useAuthSession: Session found");
          if (isMounted) {
            setUser(data.session.user);
          }
          
          try {
            // Set user name from metadata
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type, profile_completed")
              .eq("id", data.session.user.id)
              .single();
            
            if (error) {
              console.error("useAuthSession: Error fetching profile:", error);
              throw error;
            }
            
            if (profileData && isMounted) {
              setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || 'Usuário');
              // Set user type from profile
              setUserType(profileData.user_type as UserType || "participante");
              
              // Check if profile is incomplete and show toast
              if (!profileData.profile_completed) {
                toast({
                  title: "Perfil incompleto",
                  description: "Complete seu perfil para obter todas as funcionalidades.",
                });
              }
            } else if (isMounted) {
              setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante");
            }
          } catch (error) {
            console.error("useAuthSession: Error fetching profile:", error);
            if (isMounted) {
              setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante");
            }
          }
        }
      } catch (error) {
        console.error("useAuthSession: Error checking session:", error);
      } finally {
        if (isMounted) {
          setSessionCheckComplete(true);
          setLoading(false);
        }
      }
    };
    
    // Run the session check
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAuthSession: Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session && isMounted) {
          setUser(session.user);
          
          // Use setTimeout to avoid potential Supabase auth deadlock
          setTimeout(async () => {
            try {
              // Set user name and type from metadata
              const { data: profileData, error } = await supabase
                .from("profiles")
                .select("full_name, user_type, profile_completed")
                .eq("id", session.user.id)
                .single();
              
              if (error) throw error;
              
              if (profileData && isMounted) {
                setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
                // Set user type from profile with explicit type casting
                setUserType(profileData.user_type as UserType || "participante");
                
                // Check if profile is incomplete and show toast
                if (!profileData.profile_completed) {
                  toast({
                    title: "Perfil incompleto",
                    description: "Complete seu perfil para obter todas as funcionalidades.",
                  });
                }
              } else if (isMounted) {
                setUserName(session.user.email?.split('@')[0] || 'Usuário');
                setUserType("participante");
              }
            } catch (error) {
              console.error("useAuthSession: Error fetching profile after auth change:", error);
              if (isMounted) {
                setUserName(session.user.email?.split('@')[0] || 'Usuário');
                setUserType("participante");
              }
            }
          }, 0);
        } else if (event === "SIGNED_OUT" && isMounted) {
          setUser(null);
          resetUserInfo();
        }
      }
    );
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading && isMounted) {
        console.log("useAuthSession: Loading timeout reached");
        setLoading(false);
        setSessionCheckComplete(true);
      }
    }, 5000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [setUserName, setUserType, resetUserInfo, toast, loading]);

  return {
    user,
    loading,
    setLoading,
    sessionCheckComplete
  };
};
