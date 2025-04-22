
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useNavigate } from "react-router-dom";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session means not authenticated
        setIsAdmin(false);
        setLoading(false);
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
        return false;
      }
      
      // Verify if user has admin privileges (admin or moderator)
      if (profileData?.user_type === 'admin' || profileData?.user_type === 'moderator') {
        setIsAdmin(true);
        setLoading(false);
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
        return false;
      }
    } catch (error) {
      console.error("Error in admin authentication:", error);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  }, [toast, playSound]);
  
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);
  
  return { isAdmin, loading, checkAdminStatus };
};
