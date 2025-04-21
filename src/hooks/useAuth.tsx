
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SignUpCredentials, SignInCredentials, UserType } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: any;
  user: any;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials, metadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for development
const mockUser = {
  id: "mock-user-id",
  email: "user@example.com",
  user_metadata: {
    user_type: "participante",
    full_name: "Mock User"
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Development mode: authenticated by default
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(mockUser); // Use mock user data
  const { toast } = useToast();
  const navigate = useNavigate();

  // In a real implementation, this would check for a Supabase session
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        // For development, we're using mock data
        // This will be replaced with an actual Supabase session check
        const mockAuthStorage = localStorage.getItem("mockAuth");
        
        if (mockAuthStorage === "false") {
          setIsAuthenticated(false);
          setCurrentUser(null);
        } else {
          setIsAuthenticated(true);
          setCurrentUser(mockUser);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      
      // For development, we're just setting local state
      // This will be replaced with real Supabase auth
      console.log("Mock sign in with:", credentials);
      
      setIsAuthenticated(true);
      setCurrentUser(mockUser);
      
      localStorage.setItem("mockAuth", "true");
      
      toast({
        title: "Login realizado com sucesso",
        description: "Você foi autenticado com sucesso.",
      });
      
      navigate("/cliente");
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
      
      // For development, we're just updating local state
      // This will be replaced with real Supabase auth
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      localStorage.setItem("mockAuth", "false");
      
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
      
      // For development, we're just showing a success message
      // This will be replaced with real Supabase auth
      console.log("Mock sign up with:", credentials, metadata);
      
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
        user: currentUser, // Alias for currentUser
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
