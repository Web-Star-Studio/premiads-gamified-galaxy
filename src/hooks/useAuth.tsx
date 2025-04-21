
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignUpCredentials, SignInCredentials, UserType } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: any;
  userType: UserType | null;
  loading: boolean; // Alias for isLoading
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials, metadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setIsAuthenticated(true);
          setCurrentUser(data.session.user);
          
          // Fetch user type from profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", data.session.user.id)
            .single();
            
          if (profileData) {
            setUserType(profileData.user_type as UserType);
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        
        // Fetch user type from profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();
          
        if (profileData) {
          setUserType(profileData.user_type as UserType);
        }
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserType(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso",
        description: "Você foi autenticado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error.message || "Não foi possível realizar o login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível realizar o logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials, metadata?: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            user_type: credentials.userType || "participante",
            ...metadata
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar a conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        userType,
        loading: isLoading, // Alias for isLoading
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Re-export the types
export type { SignUpCredentials, SignInCredentials };
