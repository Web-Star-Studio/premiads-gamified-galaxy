
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userType?: "participante" | "anunciante";
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { setUserName, setUserType, resetUserInfo } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        
        try {
          // Set user name from metadata
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", data.session.user.id)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || 'Usuário');
            // Set user type from profile
            setUserType(profileData.user_type || "participante");
          } else {
            setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUserName(data.session.user.email?.split('@')[0] || 'Usuário');
          setUserType("participante");
        }
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          
          try {
            // Set user name and type from metadata
            const { data: profileData, error } = await supabase
              .from("profiles")
              .select("full_name, user_type")
              .eq("id", session.user.id)
              .single();
            
            if (error) throw error;
            
            if (profileData) {
              setUserName(profileData.full_name || session.user.email?.split('@')[0] || 'Usuário');
              // Set user type from profile
              setUserType(profileData.user_type || "participante");
            } else {
              setUserName(session.user.email?.split('@')[0] || 'Usuário');
              setUserType("participante");
            }
            
            // Redirect based on user type
            if (profileData?.user_type === "anunciante") {
              navigate("/anunciante");
            } else {
              navigate("/cliente");
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
            setUserName(session.user.email?.split('@')[0] || 'Usuário');
            setUserType("participante");
            navigate("/cliente");
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          resetUserInfo();
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUserName, setUserType, resetUserInfo, navigate]);

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
        setUser(data.user);
        setUserName(credentials.name);
        setUserType(credentials.userType || "participante");
        
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
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta à plataforma!",
      });
      
      if (data.user) {
        setUser(data.user);
        
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
            setUserType(profileData.user_type || "participante");
            
            // Redirect based on user type
            if (profileData.user_type === "anunciante") {
              navigate("/anunciante");
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
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message || "Ocorreu um erro durante o logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, resetUserInfo, toast]);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};
