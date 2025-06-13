import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useNavigate } from "react-router-dom";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const checkedRef = useRef<boolean>(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  const checkAdminStatus = useCallback(async () => {
    if (checkedRef.current) return isAdmin;
    
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session means not authenticated
        setIsAdmin(false);
        setLoading(false);
        checkedRef.current = true;
        return false;
      }
      
      console.log("useAdminAuth - Session found for user:", session.user.id);
      
      // Prioritize profile table as the source of truth for user_type
      console.log("useAdminAuth - Checking profiles table for user_type as primary source.");
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      let userType: string | undefined;

      if (!profileErr && profile?.user_type) {
        userType = profile.user_type;
        console.log("useAdminAuth - User type from profiles (source of truth):", userType);
      } else {
        // Fallback to metadata only if profile fetch fails
        userType = session.user.user_metadata?.user_type;
        console.warn("useAdminAuth - Could not get profile, falling back to JWT metadata. User type:", userType);
        if (profileErr) console.error("useAdminAuth - Profile fetch error:", profileErr);
      }

      const isAdminUser = userType === "admin" || userType === "moderator";
      console.log("useAdminAuth - Final admin check result:", isAdminUser, "for user type:", userType);

      setIsAdmin(isAdminUser);
      setLoading(false);
      checkedRef.current = true;
      return isAdminUser;

    } catch (error) {
      console.error("Error in admin authentication:", error);
      setIsAdmin(false);
      setLoading(false);
      checkedRef.current = true;
      return false;
    }
  }, [isAdmin]);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (isMounted) setLoading(true);
      const result = await checkAdminStatus();
      if (!isMounted) return;
      
      if (!result) {
        // If not admin, redirect to auth page
        navigate("/auth", { replace: true });
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (isMounted) {
        checkedRef.current = false; // Reset check on auth change
        checkAuth();
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus, navigate]);
  
  return { isAdmin, loading, checkAdminStatus };
};
