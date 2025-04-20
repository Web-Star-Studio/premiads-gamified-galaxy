
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const { setUserName, setUserType, setIsAuthenticated, resetUserInfo } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  const signUp = async (credentials: SignUpCredentials) => {
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
        setUserType(credentials.userType || "participante");
        setIsAuthenticated(true);
        
        // Check if profile exists, if not create one
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                full_name: credentials.name,
                user_type: credentials.userType || "participante",
                points: 0,
                credits: 0,
                profile_completed: true
              }
            ]);
          
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }
        
        // Redirect based on user type
        if (credentials.userType === "anunciante") {
          navigate("/anunciante");
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

  const signIn = async (credentials: SignInCredentials) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      playSound("chime");
      
      if (data.user) {
        setIsAuthenticated(true);
        
        try {
          // Get user profile from profiles table
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type, profile_completed")
            .eq("id", data.user.id)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            setUserName(profileData.full_name || data.user.email?.split('@')[0] || 'Usuário');
            setUserType((profileData.user_type || "participante") as "participante" | "anunciante" | "admin");
            
            toast({
              title: "Login bem-sucedido",
              description: `Bem-vindo de volta, ${profileData.full_name || 'Usuário'}!`,
            });
            
            // Redirect based on user type
            if (profileData.user_type === "anunciante") {
              navigate("/anunciante");
            } else if (profileData.user_type === "admin") {
              navigate("/admin");
            } else {
              navigate("/cliente");
            }
          } else {
            // No profile found, redirect to profile creation
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
