import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStateListener = (
  setUser: (user: User | null) => void,
  syncUserProfile: (user: User) => Promise<boolean>
) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle sign-in and token refresh events to maintain user session
      console.log("Auth state changed:", event);
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        console.log("Updating user session after", event);
        setUser(session.user);
        await syncUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, syncUserProfile]);
};
