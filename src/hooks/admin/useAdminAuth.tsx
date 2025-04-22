
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
        navigate('/auth', { replace: true });
        return;
      }
      
      // Check if user is admin by querying profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('user_type, active')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
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
        navigate('/auth', { replace: true });
        return;
      }
      
      // Verify if user has admin privileges (admin or moderator)
      if (profileData?.user_type === 'admin' || profileData?.user_type === 'moderator') {
        setIsAdmin(true);
      } else {
        // User is authenticated but not an admin or moderator, redirect to appropriate dashboard
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
  }, [checkAdminStatus]);
  
  return { isAdmin, loading };
};
