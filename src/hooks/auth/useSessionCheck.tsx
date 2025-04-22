
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/auth";

export const useSessionCheck = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          setUserProfile(null);
          return;
        }
        
        if (!session) {
          setUser(null);
          setUserProfile(null);
          return;
        }
        
        setUser(session.user);
        
        // Fetch user profile data from profiles table
        if (session.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profileData) {
            // If account is not active, sign out
            if (!profileData.active) {
              toast({
                title: "Conta desativada",
                description: "Sua conta foi desativada. Entre em contato com o suporte.",
                variant: "destructive"
              });
              await supabase.auth.signOut();
              setUser(null);
              setUserProfile(null);
              return;
            }
            
            setUserProfile(profileData as UserProfile);
          }
        }
      } catch (error) {
        console.error("Error in session check:", error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [toast]);

  return { user, setUser, userProfile, setUserProfile, loading, setLoading };
};
