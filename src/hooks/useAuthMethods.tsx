
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const { setUserName, setUserType, setIsAuthenticated, resetUserInfo, checkSession } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();
  
  // Helper function to handle errors
  const handleAuthError = (error: any, defaultMessage: string) => {
    const errorMessage = error.message || defaultMessage;
    console.error(errorMessage, error);
    playSound("error");
    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setLoading(true);
    
    try {
      // Sign up the user
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
        
        // Force a session check
        await checkSession(true);
        
        // Redirect based on user type
        if (credentials.userType === "anunciante") {
          navigate("/anunciante");
        } else {
          navigate("/cliente");
        }
      }
      
      return true;
    } catch (error: any) {
      return handleAuthError(error, "Ocorreu um erro durante o cadastro");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: SignInCredentials) => {
    setLoading(true);
    
    try {
      // Add a short delay to prevent UI flashing if auth is quick
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 500));
      
      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      // Wait for minimum loading time to complete
      await minLoadingTime;
      
      if (error) throw error;
      
      playSound("chime");
      
      if (data.user) {
        setIsAuthenticated(true);
        
        // Force a session check which will get the profile data
        await checkSession(true);
        
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso!",
        });
        
        // Let the session check handle the redirection to prevent race conditions
        return true;
      }
      
      return false;
    } catch (error: any) {
      return handleAuthError(error, "Ocorreu um erro durante o login");
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
      return handleAuthError(error, "Ocorreu um erro durante o logout");
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
