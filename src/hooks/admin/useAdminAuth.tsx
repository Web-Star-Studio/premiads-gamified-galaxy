
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();

  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session means not authenticated
        console.log("No active session, redirecting to auth");
        navigate('/auth', { replace: true });
        return;
      }
      
      setUserId(session.user.id);
      
      // Check if user is admin by querying profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
      
      // Verify if user has admin privileges
      if (profileData?.user_type === 'admin') {
        setIsAdmin(true);
      } else {
        // User is authenticated but not an admin, redirect to appropriate dashboard
        playSound('error');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel de administração.",
          variant: "destructive"
        });
        
        // Redirect based on user type
        const redirectPath = profileData?.user_type === 'anunciante' 
          ? '/anunciante' 
          : '/cliente';
        
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error("Error in admin authentication:", error);
      navigate('/auth', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast, playSound]);
  
  useEffect(() => {
    checkAdminStatus();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserId(null);
        navigate('/auth', { replace: true });
      } else if (event === 'USER_UPDATED' && session) {
        // Re-check admin status when user is updated
        checkAdminStatus();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus, navigate]);
  
  return { isAdmin, loading, userId, refreshStatus: checkAdminStatus };
};
