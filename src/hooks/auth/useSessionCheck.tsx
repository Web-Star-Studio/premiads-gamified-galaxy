import { useState, useEffect, useRef, MutableRefObject } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/auth";

// Helper to create a fallback profile without hitting the DB again
const createMemoryProfile = (user: User): UserProfile => ({
  id: user.id,
  email: user.email,
  full_name: user.user_metadata?.full_name || user.email || 'Usuário',
  user_type: user.user_metadata?.user_type || 'participante',
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const useSessionCheck = (sessionCheckRef?: MutableRefObject<boolean>) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const internalCheckRef = useRef<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Flag to prevent running the effect twice in dev mode
    if (internalCheckRef.current || sessionCheckRef?.current) {
      return;
    }
    internalCheckRef.current = true;
    if (sessionCheckRef) sessionCheckRef.current = true;
    
    setLoading(true);

    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        if(sessionError) console.error("Session error:", sessionError);
        return;
      }
      
      const currentUser = session.user;
      
      // Early exit for banned users
      if ((currentUser as any).banned_until && new Date((currentUser as any).banned_until) > new Date()) {
        toast({
          title: "Conta bloqueada",
          description: "Sua conta foi desativada. Entre em contato com o suporte.",
          variant: "destructive"
        });
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }
      
      // Now, fetch profile, but don't block rendering the user
      setUser(currentUser);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
        
      if (profileData && profileData.active) {
        setUserProfile(profileData as UserProfile);
      } else if (profileData && !profileData.active) {
        toast({
          title: "Conta desativada",
          description: "Sua conta foi desativada. Entre em contato com o suporte.",
          variant: "destructive"
        });
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
      } else if (profileError) {
        console.error("Error fetching profile, using fallback:", profileError.message);
        // Don't auto-create profile here on check, just use a memory fallback
        // The creation can be triggered by another process if needed.
        setUserProfile(createMemoryProfile(currentUser));
      }
      
      setLoading(false);
    };

    checkSession();

  }, [toast, sessionCheckRef]);

  return { user, setUser, userProfile, setUserProfile, loading, setLoading };
};
