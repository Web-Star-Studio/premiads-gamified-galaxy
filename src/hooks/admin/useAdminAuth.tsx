
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
      
      // Check if user is admin by querying profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('user_type, active')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        setIsAdmin(false);
        setLoading(false);
        checkedRef.current = true;
        return false;
      }
      
      // Check if the account is active
      if (profileData && !profileData.active) {
        playSound('error');
        toast({
          title: "Conta desativada",
          description: "Sua conta está desativada. Entre em contato com o suporte.",
          variant: "destructive"
        });
        await supabase.auth.signOut();
        setIsAdmin(false);
        setLoading(false);
        checkedRef.current = true;
        return false;
      }
      
      // Verify if user has admin privileges (admin or moderator)
      if (profileData?.user_type === 'admin' || profileData?.user_type === 'moderator') {
        setIsAdmin(true);
        setLoading(false);
        checkedRef.current = true;
        return true;
      } else {
        // User is authenticated but not an admin or moderator
        playSound('error');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel de administração.",
          variant: "destructive"
        });
        setIsAdmin(false);
        setLoading(false);
        checkedRef.current = true;
        return false;
      }
    } catch (error) {
      console.error("Error in admin authentication:", error);
      setIsAdmin(false);
      setLoading(false);
      checkedRef.current = true;
      return false;
    }
  }, [toast, playSound, isAdmin]);
  
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
