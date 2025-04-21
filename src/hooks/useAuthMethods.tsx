
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { signOutAndCleanup } from "@/utils/auth";
import { SignUpCredentials, SignInCredentials, UserType } from "@/types/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const [sessionCheckInProgress, setSessionCheckInProgress] = useState(false);
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
      // --- Restrição: só permite 'participante' e 'anunciante' no registro ---
      if (credentials.userType === "admin") {
        toast({
          title: "Cadastro não permitido",
          description: "Não é possível registrar administradores pelo painel padrão.",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }

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
        await checkSession();
        
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
    if (sessionCheckInProgress) {
      console.log("Session check in progress, waiting...");
      return false;
    }

    setLoading(true);
    setSessionCheckInProgress(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setIsAuthenticated(true);
        
        // Get user profile to determine type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type, full_name')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name);
          // Fix: Cast the user_type string to UserType
          const userType = profile.user_type as UserType;
          setUserType(userType);

          // Redirect based on user type
          switch (userType) {
            case 'admin':
              navigate('/admin');
              break;
            case 'anunciante':
              navigate('/anunciante');
              break;
            default:
              navigate('/cliente');
          }

          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!",
          });
          
          return true;
        }
      }
      
      return false;
    } catch (error: any) {
      return handleAuthError(error, "Ocorreu um erro durante o login");
    } finally {
      setLoading(false);
      setSessionCheckInProgress(false);
    }
  };

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Attempting to sign out...");
      await signOutAndCleanup(); // Use robust global handler
      resetUserInfo();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      return true;
    } catch (error: any) {
      playSound("error");
      toast({
        title: "Erro ao sair",
        description: error?.message || "Não foi possível realizar o logout.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [resetUserInfo, toast, playSound]);

  return {
    loading,
    signUp,
    signIn,
    signOut
  };
};
