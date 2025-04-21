import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials, SignInCredentials, UserType } from "@/types/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const { setUserName, setUserType, resetUserInfo } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  // Keep the return type as Promise<boolean> for internal use
  const signUp = async (credentials: SignUpCredentials): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            user_type: credentials.userType || "participante"
          }
        }
      });
      
      if (error) throw error;
      
      playSound("chime");
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Bem-vindo à plataforma de engajamento!",
      });
      
      if (data.user) {
        setUserName(credentials.name);
        setUserType(credentials.userType as UserType || "participante");
        
        // Redirect based on user type
        if (credentials.userType === "anunciante") {
          navigate("/anunciante");
        } else if (credentials.userType === "admin") {
          navigate("/admin");
        } else if (credentials.userType === "moderator") {
          navigate("/admin");
        } else {
          navigate("/cliente");
        }
      }
      
      return true;
    } catch (error: any) {
      playSound("error");
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro durante o cadastro",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Keep the return type as Promise<boolean> for internal use
  const signIn = async (credentials: SignInCredentials): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      playSound("chime");
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta à plataforma!",
      });
      
      if (data.user) {
        try {
          // Set user name from metadata
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", data.user.id)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            setUserName(profileData.full_name || data.user.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as UserType);
            
            // Redirect based on user type
            if (profileData.user_type === "anunciante") {
              navigate("/anunciante");
            } else if (profileData.user_type === "admin" || profileData.user_type === "moderator") {
              navigate("/admin");
            } else {
              navigate("/cliente");
            }
          } else {
            setUserName(data.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante");
            navigate("/cliente");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUserName(data.user.email?.split('@')[0] || 'Usuário');
          setUserType("participante");
          navigate("/cliente");
        }
      }
      
      return true;
    } catch (error: any) {
      playSound("error");
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = useCallback(async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      resetUserInfo();
      navigate("/");
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message || "Ocorreu um erro durante o logout",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, resetUserInfo, toast]);

  return {
    loading,
    signUp,
    signIn,
    signOut
  };
};
