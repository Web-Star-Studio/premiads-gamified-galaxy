
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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
  const [authCheckTimeout, setAuthCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAuthTimeout = useCallback(() => {
    // Clear any existing timeout
    if (authCheckTimeout) {
      clearTimeout(authCheckTimeout);
    }
    
    // Set a new timeout
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Authentication check is taking longer than expected");
        setIsLoading(false);
      }
    }, 8000);
    
    setAuthCheckTimeout(timeoutId);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authCheckTimeout, isLoading]);

  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        setIsLoading(true);
        checkAuthTimeout();
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          if (isMounted) {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setIsLoading(false);
          }
          return;
        }
        
        if (data.session) {
          if (isMounted) {
            setIsAuthenticated(true);
            setCurrentUser(data.session.user);
            
            // Fetch user type in a separate, non-blocking operation
            setTimeout(async () => {
              try {
                const { data: profileData, error: profileError } = await supabase
                  .from("profiles")
                  .select("user_type")
                  .eq("id", data.session.user.id)
                  .single();
                
                if (profileError) {
                  console.warn("Error fetching user profile:", profileError);
                  return;
                }
                
                if (profileData && isMounted) {
                  setUserType(profileData.user_type as UserType);
                }
              } catch (profileError) {
                console.error("Error in profile fetch:", profileError);
              }
            }, 0);
          }
        } else {
          if (isMounted) {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          if (authCheckTimeout) clearTimeout(authCheckTimeout);
        }
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (isMounted) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
          
          // Fetch user type in a separate, non-blocking operation
          setTimeout(async () => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("user_type")
                .eq("id", session.user.id)
                .single();
                
              if (profileError) {
                console.warn("Error fetching user profile on sign in:", profileError);
                return;
              }
              
              if (profileData && isMounted) {
                setUserType(profileData.user_type as UserType);
              }
            } catch (error) {
              console.error("Error fetching profile on sign in:", error);
            }
          }, 0);
        }
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserType(null);
        }
      }
    });

    return () => {
      isMounted = false;
      if (authCheckTimeout) clearTimeout(authCheckTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [checkAuthTimeout, authCheckTimeout]);

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
