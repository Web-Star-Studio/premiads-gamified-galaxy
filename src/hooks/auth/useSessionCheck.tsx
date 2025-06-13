import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "@/integrations/supabase/client";
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
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError) {
              // If profile not found (PGRST116) create it on the fly
              if (profileError.code === 'PGRST116') {
                try {
                  const fallbackProfile = {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: (session.user.user_metadata as any)?.full_name || session.user.email,
                    user_type: (session.user.user_metadata as any)?.user_type || 'participante',
                    active: true,
                  };

                  // Use supabaseAdmin to bypass RLS policies
                  const { error: insertErr, data: insertData } = await supabaseAdmin
                    .from('profiles')
                    .insert(fallbackProfile)
                    .select()
                    .single();

                  if (insertErr) {
                    console.error('Failed to auto-create profile:', insertErr);
                    
                    // Even if we can't create the profile, continue with a memory-only profile
                    // This allows the UI to function even if the profile creation fails
                    setUserProfile({
                      ...fallbackProfile,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    } as UserProfile);
                  } else {
                    setUserProfile(insertData as UserProfile);
                  }
                } catch (createError) {
                  console.error('Exception during profile creation:', createError);
                  
                  // Create an in-memory profile as fallback
                  const memoryProfile = {
                    id: session.user.id,
                    email: session.user.email,
                    full_name: (session.user.user_metadata as any)?.full_name || session.user.email,
                    user_type: (session.user.user_metadata as any)?.user_type || 'participante',
                    active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  } as UserProfile;
                  
                  setUserProfile(memoryProfile);
                }
              } else {
                console.error('Error fetching profile:', profileError);
              }
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
          } catch (profileError) {
            console.error('Exception during profile check:', profileError);
            
            // Create an in-memory profile as last resort
            const memoryProfile = {
              id: session.user.id,
              email: session.user.email,
              full_name: (session.user.user_metadata as any)?.full_name || session.user.email,
              user_type: (session.user.user_metadata as any)?.user_type || 'participante',
              active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as UserProfile;
            
            setUserProfile(memoryProfile);
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
