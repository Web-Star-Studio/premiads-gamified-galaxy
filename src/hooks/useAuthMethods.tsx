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
      // Input validation
      if (!credentials.email || !credentials.password || !credentials.name) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      if (credentials.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres");
      }
      
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
      
      // Check if user is already registered
      if (data?.user && data.user.identities?.length === 0) {
        throw new Error("Email já cadastrado. Por favor, tente fazer login.");
      }
      
      playSound("chime");
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
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
      // Better error handling with appropriate messages
      let errorMessage = error.message || "Ocorreu um erro durante o cadastro";
      
      // Translate common Supabase error messages
      if (error.message.includes("Email already registered")) {
        errorMessage = "Email já cadastrado. Por favor, tente fazer login.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Email inválido. Por favor, verifique e tente novamente.";
      } 
      
      playSound("error");
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
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
      // Input validation
      if (!credentials.email || !credentials.password) {
        throw new Error("Email e senha são obrigatórios");
      }
      
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
          // Check if account is active
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type, active")
            .eq("id", data.user.id)
            .single();
          
          if (error) throw error;
          
          // Check if user is active
          if (profileData && profileData.active === false) {
            // Log the user out immediately
            await supabase.auth.signOut();
            throw new Error("Sua conta está desativada. Entre em contato com o suporte.");
          }
          
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
      // Better error handling with appropriate messages
      let errorMessage = error.message || "Ocorreu um erro durante o login";
      
      // Translate common Supabase error messages
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos. Por favor, tente novamente.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Muitas tentativas. Por favor, tente novamente mais tarde.";
      }
      
      playSound("error");
      toast({
        title: "Erro no login",
        description: errorMessage,
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

  // Add password recovery functionality
  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (!email) {
        throw new Error("Email é obrigatório");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth?reset=true',
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      
      return true;
    } catch (error: any) {
      let errorMessage = error.message || "Erro ao enviar email de recuperação";
      
      if (error.message.includes("User not found")) {
        errorMessage = "Usuário não encontrado com este email.";
      }
      
      toast({
        title: "Erro na recuperação de senha",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add update password functionality
  const updatePassword = async (password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro na atualização da senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
