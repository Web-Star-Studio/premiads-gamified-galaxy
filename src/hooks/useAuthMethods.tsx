
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInCredentials, SignUpCredentials } from "@/types/auth";
import { signOutAndCleanup } from "@/utils/auth";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (credentials: SignInCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Identificar casos específicos
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e confirme seu cadastro.",
            variant: "destructive"
          });
          throw new Error("Email not confirmed");
        }
        
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Verifique suas credenciais e tente novamente.",
          variant: "destructive"
        });
        throw error;
      }
      
      if (!data?.session) {
        toast({
          title: "Erro no login",
          description: "Não foi possível obter a sessão. Tente novamente.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      // Erro já tratado acima
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, password, userType }: SignUpCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validar parâmetros
      if (!email || !password || !name) {
        toast({
          title: "Campos obrigatórios",
          description: "Todos os campos são obrigatórios",
          variant: "destructive"
        });
        return false;
      }
      
      // Registrar o usuário com Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_type: userType || "participante"
          },
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        
        // Erro de email já registrado
        if (error.message.includes("User already registered")) {
          toast({
            title: "Email já registrado",
            description: "Este email já está em uso. Tente fazer login ou recuperar sua senha.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Não foi possível completar o cadastro. Tente novamente.",
            variant: "destructive"
          });
        }
        
        throw error;
      }
      
      if (!data?.user) {
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível criar o usuário. Tente novamente.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      // Erro já tratado acima
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      setLoading(true);
      await signOutAndCleanup();
      return true;
    } catch (error: any) {
      console.error("Signout error:", error);
      toast({
        title: "Erro ao sair",
        description: error?.message || "Não foi possível desconectar. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading
  };
};
