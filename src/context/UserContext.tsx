import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { UserType } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  checkSession: (force?: boolean) => Promise<boolean>;
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
  const { toast } = useToast();

  // Centralized session checking function with caching - modified to accept an optional force parameter
  const checkSession = useCallback(async (force?: boolean): Promise<boolean> => {
    // Skip duplicate checks in short time periods unless forced
    const now = Date.now();
    if (!force && lastAuthCheck && now - lastAuthCheck < 5000) {
      return isAuthenticated;
    }
    
    setLastAuthCheck(now);
    
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setAuthError("Erro ao verificar sua sessão.");
        setIsAuthenticated(false);
        setUserId(null);
        return false;
      }
      
      if (!data.session) {
        // No active session
        setIsAuthenticated(false);
        setUserId(null);
        return false;
      }
      
      // We have a valid session
      setIsAuthenticated(true);
      setUserId(data.session.user.id);
      
      // Only fetch profile data if we haven't already or if forced
      if (force || !userName) {
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
      
      return true;
    } catch (error) {
      console.error("Error in checkSession:", error);
      setAuthError("Erro ao verificar sessão. Tente novamente.");
      return false;
    }
  }, [isAuthenticated, lastAuthCheck, userName]);

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsAuthLoading(true);
        await checkSession(true);
      } catch (error) {
        console.error("Error loading user data:", error);
        setAuthError("Erro ao carregar dados do usuário.");
      } finally {
        setIsAuthLoading(false);
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
          
          try {
            // Set user name and type from profile
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("full_name, user_type")
              .eq("id", session.user.id)
              .single();
            
            if (profileError) throw profileError;
            
            if (profileData) {
              setUserName(profileData.full_name || session.user.email?.split('@')[0] || "");
              setUserType(profileData.user_type as UserType || "participante");
            } else {
              setUserName(session.user.email?.split('@')[0] || "");
            }
          } catch (error) {
            console.warn("Error loading profile after sign in:", error);
            setUserName(session.user.email?.split('@')[0] || "");
          }
        } else if (event === "SIGNED_OUT") {
          resetUserInfo();
          setUserId(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    // Set a timeout for auth loading
    const loadingTimeout = setTimeout(() => {
      if (isAuthLoading) {
        setIsAuthLoading(false);
        setAuthError("A verificação está demorando mais que o esperado. Verifique sua conexão.");
      }
    }, 10000);
    
    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [checkSession]);

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
