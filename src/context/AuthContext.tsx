
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserType, UserProfile, SignUpCredentials, SignInCredentials } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  session: Session | null;
  userType: UserType;
  signIn: (credentials: SignInCredentials) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>("client");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Exception fetching profile:", error);
      return null;
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (!session?.user.id) return;
    
    try {
      const profileData = await fetchUserProfile(session.user.id);
      if (profileData) {
        setProfile(profileData);
        setUserType(profileData.user_type as UserType);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // Initialize auth state and set up auth state change listener
  useEffect(() => {
    // Flag to track component mount status
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      
      if (!isMounted) return;
      
      if (event === "SIGNED_IN" && newSession) {
        setSession(newSession);
        setIsAuthenticated(true);
        
        // Load user profile data after a brief delay to avoid auth deadlocks
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const profileData = await fetchUserProfile(newSession.user.id);
            
            if (profileData && isMounted) {
              setProfile(profileData);
              setUserType(profileData.user_type as UserType);
              setIsLoading(false);
            } else {
              // Default userType if no profile is found
              setUserType("client");
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error fetching profile on sign in:", error);
            setIsLoading(false);
          }
        }, 0);
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          setIsAuthenticated(false);
          setProfile(null);
          setSession(null);
          setUserType("client");
          setIsLoading(false);
        }
      } else if (event === "TOKEN_REFRESHED" && newSession) {
        setSession(newSession);
      }
    });
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (data.session) {
          if (isMounted) {
            setSession(data.session);
            setIsAuthenticated(true);
            
            // Fetch profile data for the authenticated user
            const profileData = await fetchUserProfile(data.session.user.id);
            
            if (profileData && isMounted) {
              setProfile(profileData);
              setUserType(profileData.user_type as UserType);
            }
          }
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        if (isMounted) {
          setIsLoading(false);
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
          title: "Authentication Error",
          description: error.message || "Could not sign in",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      // Session is set by the auth state listener
      toast({
        title: "Login Successful",
        description: "You have successfully signed in",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Could not sign in",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged Out",
        description: "You have been signed out successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error Signing Out",
        description: error.message || "Could not sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Set default user type if not provided
      const userType = credentials.userType || "client";
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            user_type: userType
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message || "Could not create account",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      if (!data.user) {
        toast({
          title: "Sign Up Error",
          description: "No user data returned",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Create profile in profiles table if it doesn't exist
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      // If profile doesn't exist (or there was an error indicating no profile), create it
      if (profileError && profileError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: credentials.name,
            user_type: userType,
            points: 0,
            credits: 0,
            profile_completed: true,
            email_notifications: true,
            push_notifications: true
          });

        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "Could not create account",
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
        profile,
        session,
        userType,
        signIn,
        signOut,
        signUp,
        refreshProfile
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
