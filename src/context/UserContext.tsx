
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { UserType } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  resetUserInfo: () => void;
  saveUserPreferences: () => Promise<void>;
  isAuthLoading: boolean;
  authError: string | null;
  checkSession: () => Promise<boolean>;
};

const defaultContext: UserContextType = {
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  isAuthenticated: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  setIsAuthenticated: () => {},
  resetUserInfo: () => {},
  saveUserPreferences: async () => {},
  isAuthLoading: true,
  authError: null,
  checkSession: async () => false,
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);
  const [authCheckInProgress, setAuthCheckInProgress] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Centralized session checking function with caching and timeouts
  const checkSession = useCallback(async (): Promise<boolean> => {
    // Prevent multiple concurrent checks
    if (authCheckInProgress) {
      console.log("Auth check already in progress, skipping duplicate call");
      return isAuthenticated;
    }
    
    // Skip duplicate checks in short time periods
    const now = Date.now();
    if (lastAuthCheck && now - lastAuthCheck < 5000) {
      console.log("Recent auth check exists, using cached result");
      return isAuthenticated;
    }
    
    setAuthCheckInProgress(true);
    setLastAuthCheck(now);
    
    // Setup a timeout to prevent hanging
    const authTimeout = setTimeout(() => {
      if (authCheckInProgress) {
        console.warn("Auth check timed out after 8 seconds");
        setAuthCheckInProgress(false);
        setAuthError("Verificação de autenticação demorou muito. Tente novamente.");
      }
    }, 8000);
    
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.getSession();
      
      // Clear the timeout as we got a response
      clearTimeout(authTimeout);
      
      if (error) {
        console.error("Session error:", error);
        setAuthError("Erro ao verificar sua sessão.");
        setIsAuthenticated(false);
        setUserId(null);
        setAuthCheckInProgress(false);
        return false;
      }
      
      if (!data.session) {
        // No active session
        console.log("No active session found");
        setIsAuthenticated(false);
        setUserId(null);
        setAuthCheckInProgress(false);
        return false;
      }
      
      // We have a valid session
      setIsAuthenticated(true);
      setUserId(data.session.user.id);
      
      // Only fetch profile data if we haven't already
      if (!userName || !userId) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", data.session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData) {
            setUserName(profileData.full_name || data.session.user.email?.split('@')[0] || "");
            setUserType(profileData.user_type as UserType || "participante");
          } else {
            setUserName(data.session.user.email?.split('@')[0] || "");
          }
        } catch (profileError) {
          console.warn("Could not fetch profile, using defaults:", profileError);
          setUserName(data.session.user.email?.split('@')[0] || "");
        }
      }
      
      setAuthCheckInProgress(false);
      return true;
    } catch (error) {
      console.error("Error in checkSession:", error);
      setAuthError("Erro ao verificar sessão. Tente novamente.");
      clearTimeout(authTimeout);
      setAuthCheckInProgress(false);
      return false;
    }
  }, [isAuthenticated, lastAuthCheck, userName, userId, authCheckInProgress]);

  // Load user data when component mounts
  useEffect(() => {
    let isMounted = true;
    let authTimeoutId: NodeJS.Timeout;
    
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        
        // Set a timeout for the initial auth check
        authTimeoutId = setTimeout(() => {
          if (isMounted && isAuthLoading) {
            console.log("Initial auth check taking too long, setting timeout");
            setIsAuthLoading(false);
            setAuthError("A verificação está demorando mais que o esperado. Verifique sua conexão.");
          }
        }, 10000);
        
        const authenticated = await checkSession();
        
        if (isMounted) {
          setIsAuthLoading(false);
          
          // If not authenticated and on a protected route, redirect to home
          if (!authenticated && window.location.pathname.includes('/cliente')) {
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        if (isMounted) {
          setIsAuthLoading(false);
          setAuthError("Erro ao carregar dados do usuário.");
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };
    
    loadUserData();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          // Load user profile in a non-blocking way
          setTimeout(async () => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("full_name, user_type")
                .eq("id", session.user.id)
                .single();
              
              if (profileError) throw profileError;
              
              if (profileData && isMounted) {
                setUserName(profileData.full_name || session.user.email?.split('@')[0] || "");
                setUserType(profileData.user_type as UserType || "participante");
              }
            } catch (error) {
              console.warn("Error loading profile after sign in:", error);
              if (isMounted) {
                setUserName(session.user.email?.split('@')[0] || "");
              }
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
          
          // Redirect to home page if on a protected route
          if (window.location.pathname.includes('/cliente')) {
            navigate('/');
          }
        }
      }
    );
    
    return () => {
      isMounted = false;
      clearTimeout(authTimeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [checkSession, navigate]);

  const resetUserInfo = useCallback(() => {
    setUserName("");
    setUserType("participante");
    setIsOverlayOpen(false);
    setIsAuthenticated(false);
    setUserId(null);
  }, []);

  // Save user preferences to Supabase
  const saveUserPreferences = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userName,
          user_type: userType,
          updated_at: new Date().toISOString(),
          profile_completed: true
        })
        .eq("id", userId);
      
      if (error) {
        console.error("Error saving preferences:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar suas preferências.",
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Suas preferências foram salvas com sucesso.",
      });
      
      console.log("User preferences saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        isOverlayOpen,
        isAuthenticated,
        setUserName,
        setUserType,
        setIsOverlayOpen,
        setIsAuthenticated,
        resetUserInfo,
        saveUserPreferences,
        isAuthLoading,
        authError,
        checkSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
