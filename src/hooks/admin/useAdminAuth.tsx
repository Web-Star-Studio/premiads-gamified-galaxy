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
      
      // Temporarily allow all authenticated users access
      setIsAdmin(true);
      setLoading(false);
      checkedRef.current = true;
      return true;

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
