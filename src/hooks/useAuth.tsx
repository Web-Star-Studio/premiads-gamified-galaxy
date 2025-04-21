
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
  signIn: (credentials: SignInCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials, metadata?: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state and set up auth state change listener
  useEffect(() => {
    // Flag to track component mount status
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (!isMounted) return;
      
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        setIsLoading(true); // Set loading true until we fetch the profile
        
        try {
          console.log("Fetching user profile after sign in...");
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .single();
            
          if (profileError) {
            console.warn("Error fetching user profile on sign in:", profileError);
            setIsLoading(false);
            return;
          }
          
          if (profileData && isMounted) {
            console.log("User profile loaded successfully:", profileData);
            setUserType(profileData.user_type as UserType);
          }
        } catch (error) {
          console.error("Error fetching profile on sign in:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserType(null);
          setIsLoading(false);
        }
      }
    });
    
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing auth session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          if (isMounted) {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }
        
        if (data.session) {
          console.log("Existing session found:", data.session.user.id);
          if (isMounted) {
            setIsAuthenticated(true);
            setCurrentUser(data.session.user);
            
            try {
              console.log("Fetching user profile data...");
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("user_type")
                .eq("id", data.session.user.id)
                .single();
              
              if (profileError) {
                console.warn("Error fetching user profile:", profileError);
              } else if (profileData && isMounted) {
                console.log("User profile found:", profileData);
                setUserType(profileData.user_type as UserType);
              }
            } catch (profileError) {
              console.error("Error in profile fetch:", profileError);
            } finally {
              if (isMounted) {
                setIsLoading(false);
                setSessionChecked(true);
              }
            }
          }
        } else {
          console.log("No existing session found");
          if (isMounted) {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setIsLoading(false);
            setSessionChecked(true);
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        if (isMounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };
    
    // Run session check
    checkSession();
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("Session check timeout reached");
        setIsLoading(false);
        setSessionChecked(true);
      }
    }, 8000);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast({
          title: "Erro na autenticação",
          description: error.message || "Não foi possível realizar o login.",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        try {
          // Get user type from profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", data.user.id)
            .single();
          
          if (profileError) {
            console.warn("Error fetching user profile after login:", profileError);
          } else if (profileData) {
            console.log("User profile after login:", profileData);
            setUserType(profileData.user_type as UserType);
          }
        } catch (error) {
          console.error("Error fetching profile after login:", error);
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Você foi autenticado com sucesso.",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error.message || "Não foi possível realizar o login.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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

  const signUp = async (credentials: SignUpCredentials, metadata?: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Signing up with credentials:", { 
        email: credentials.email, 
        userType: credentials.userType || "participante"
      });
      
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message || "Não foi possível criar a conta.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
      
      // Check if user was created successfully
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
          console.log("Creating new profile with user type:", credentials.userType || "participante");
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                full_name: credentials.name,
                user_type: credentials.userType || "participante",
                points: 0,
                credits: 0,
                profile_completed: false
              }
            ]);
          
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar a conta.",
        variant: "destructive",
      });
      return false;
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
