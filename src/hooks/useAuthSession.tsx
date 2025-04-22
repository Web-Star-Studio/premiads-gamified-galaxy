
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
        
        console.log("Fetching profile for user:", validUser.id);
        
        try {
          // Check user profile and status
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type, profile_completed, active")
            .eq("id", validUser.id)
            .maybeSingle(); // Use maybeSingle instead of single to handle case when profile doesn't exist
          
          if (error) {
            console.error("Error fetching profile:", error);
            // Don't throw the error, continue with user metadata
          }
          
          console.log("Profile data:", profileData);
          
          if (profileData) {
            // Check if account is active
            if (profileData.active === false) {
              console.log("Account inactive, logging out");
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
            
            setUserName(profileData.full_name || validUser.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as UserType);
            
            // Debug log
            console.log("Set user type to:", profileData.user_type);
            
            // Check if profile is incomplete
            if (!profileData.profile_completed) {
              toast({
                title: "Perfil incompleto",
                description: "Complete seu perfil para obter todas as funcionalidades.",
              });
            }
          } else {
            console.warn("No profile found for user:", validUser.id);
            // Fallback to user metadata for type
            const userTypeFromMetadata = validUser.user_metadata?.user_type as UserType;
            setUserName(validUser.email?.split('@')[0] || 'Usuário');
            setUserType(userTypeFromMetadata || "participante" as UserType);
            console.log("Using user type from metadata:", userTypeFromMetadata);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Fallback to user metadata
          const userTypeFromMetadata = validUser.user_metadata?.user_type as UserType;
          setUserName(validUser.email?.split('@')[0] || 'Usuário');
          setUserType(userTypeFromMetadata || "participante" as UserType);
          console.log("Using user type from metadata (after error):", userTypeFromMetadata);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes with improved error handling
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        
        // Using setTimeout to avoid deadlocks in Supabase auth
        setTimeout(async () => {
          try {
            console.log("Fetching profile after sign in for:", session.user.id);
            
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type, profile_completed, active")
              .eq("id", session.user.id)
              .maybeSingle(); // Use maybeSingle instead of single
            
            if (error) {
              console.error("Error fetching profile after sign in:", error);
              // Fallback to user metadata
              const userTypeFromMetadata = session.user.user_metadata?.user_type as UserType;
              setUserName(session.user.email?.split('@')[0] || 'Usuário');
              setUserType(userTypeFromMetadata || "participante");
              return;
            }
            
            console.log("Profile data after sign in:", profileData);
            
            if (profileData) {
              // Check if account is active
              if (profileData.active === false) {
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
              
              // Debug log
              console.log("Updated user type to:", profileData.user_type);
              
              if (!profileData.profile_completed) {
                toast({
                  title: "Perfil incompleto",
                  description: "Complete seu perfil para obter todas as funcionalidades.",
                });
              }
            } else {
              console.log("No profile found, using metadata for user type");
              const userTypeFromMetadata = session.user.user_metadata?.user_type as UserType;
              setUserName(session.user.email?.split('@')[0] || 'Usuário');
              setUserType(userTypeFromMetadata || "participante");
            }
          } catch (error) {
            console.error("Error setting up user session:", error);
            // Fallback to user metadata
            const userTypeFromMetadata = session.user.user_metadata?.user_type as UserType;
            setUserName(session.user.email?.split('@')[0] || 'Usuário');
            setUserType(userTypeFromMetadata || "participante");
          }
        }, 0);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setUser(null);
        resetUserInfo();
      }
    });
    
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
